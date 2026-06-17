import {
  Duplex,
  DuplexOptions,
  PassThrough,
  pipeline,
  Transform,
  TransformCallback,
} from "node:stream";

import { HybridCrawlCache } from "../storage/cache";
import {
  APIWebsiteInfo,
  CrawlData,
  CrawlInfo,
  FetchFunction,
  InternalStage,
  RequestObject,
  RequestOptions,
  isCrawlInfo,
} from "../types/interface";
import { defaultStealthFetch } from "./fetcher";
import { PipelineTransform } from "./pipeline-transform";
import { HostRateLimiter } from "./rate-limiter";
import { ScraperRegistry } from "./registry";

/**
 * The crawl stream extending the Node's {@link Duplex} class.
 * The stream acts as a wrapper for the Fetch -> Extract -> Parse pipeline.
 * It is a Duplex stream where the writable side feeds the pipeline (init stage)
 * and the readable side outputs the final results.
 * It uses {@link PipelineTransform} for async stages to manage concurrency and state,
 * and standard {@link Transform} for synchronous post-processing.
 */
class CrawlStream<Raw, Final = Raw, Fetched = Response> extends Duplex {
  private readonly info?: APIWebsiteInfo<Raw, Final, Fetched>;
  private readonly cache = new HybridCrawlCache();
  private readonly rateLimiter = new HostRateLimiter();
  public readonly monitorStream: PassThrough;

  // Pipeline stages
  private readonly inputTransform: Transform;
  private readonly fetchStream: PipelineTransform<
    CrawlInfo<InternalStage.Init>,
    CrawlInfo<InternalStage.Fetch>
  >;
  private readonly extractStream: PipelineTransform<
    CrawlInfo<InternalStage.Fetch>,
    CrawlInfo<InternalStage.Extract>[]
  >;
  private readonly parseStream?: PipelineTransform<
    CrawlInfo<InternalStage.Extract>,
    CrawlInfo<InternalStage.Parse>
  >;
  private readonly outputTransform: Transform;
  private readonly streamOptions: {
    concurrency: number;
    highWaterMark: number;
  };

  /**
   * Constructs a new CrawlStream.
   * @param info The website info implementation (fetch, extract, parse logic).
   * @param options Stream options including concurrency and custom log path.
   */
  constructor(
    info?: APIWebsiteInfo<Raw, Final, Fetched>,
    options?: Omit<DuplexOptions, "objectMode"> & {
      concurrency?: number;
      logPath?: string;
    }
  ) {
    super({ objectMode: true, ...options });

    this.info = info;
    this.streamOptions = {
      concurrency: options?.concurrency ?? 10,
      highWaterMark: options?.highWaterMark ?? 64,
    };
    this.monitorStream = new PassThrough({ objectMode: true });
    this.inputTransform = this.initStage(this.createInputTransform);

    // Initialize pipeline stages
    this.fetchStream = this.initStage(this.createFetchStream);
    this.extractStream = this.initStage(this.createExtractStream);
    this.outputTransform = this.createResultFilter();

    const streams: PipelineTransform<any, any>[] = [this.fetchStream, this.extractStream];

    if (!this.info || this.info.parse) {
      this.parseStream = this.initStage(this.createParseStream);
      streams.push(this.parseStream);
    }

    // Use pipeline for error propagation and cleanup
    const pipelineStreams: (Transform | Duplex)[] = [
      this.inputTransform,
      ...streams,
      this.outputTransform,
    ];

    pipeline(pipelineStreams, (err) => {
      if (err) this.emit("error", err);
    });

    // Listen to outputs from the final filter and push them to the Duplex's readable side
    this.outputTransform.on("data", (chunk: any) => {
      if (!this.push(chunk)) {
        this.outputTransform.pause();
      }
    });

    // Handle errors logic (Monitor stream)
    this.monitorStream.on("error", (err) => this.emit("error", err));
  }

  /**
   * Writes data to the stream (input for the pipeline).
   * Passed chunks are written to the internal `fetchStream`.
   * @param chunk The data chunk to write (usually CrawlInfo).
   * @param encoding The encoding (ignored for object mode).
   * @param callback Callback when write is complete.
   */
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
    if (this.inputTransform.write(chunk, encoding)) {
      callback();
    } else {
      this.inputTransform.once("drain", callback);
    }
  }

  /**
   * Finalizes the stream.
   * Ends the internal `fetchStream`, which triggers a cascade of endings through the pipeline.
   * @param callback Callback when finalization is complete.
   */
  _final(callback: (error?: Error | null) => void): void {
    this.inputTransform.end(() => {
      callback();
    });
  }

  /**
   * Reads data from the stream (output from the pipeline).
   * Resumes the `resultFilter` if it was paused.
   * @param size Number of bytes to read (ignored for object mode).
   */
  _read(_size: number): void {
    // Resume pipeline if it was paused
    if (this.outputTransform.isPaused()) {
      this.outputTransform.resume();
    }
  }

  /**
   * Creates the Input transform stream.
   * Transforms raw `RequestOptions` (or existing `CrawlInfo`) into `CrawlInfo<Init>`.
   */
  private readonly createInputTransform = () => {
    return new Transform({
      objectMode: true,
      transform(chunk: RequestOptions, encoding, callback) {
        if (isCrawlInfo(chunk)) {
          this.push(chunk);
          callback();
          return;
        }

        let { request, product } = chunk;

        // Normalize RequestOptions to RequestObject
        let requestObject: RequestObject;
        if (typeof request === "string" || request instanceof URL) {
          requestObject = { url: new URL(request.toString()) };
        } else if ("url" in request && !(request.url instanceof URL)) {
          requestObject = { ...request, url: new URL(request.url) };
        } else {
          requestObject = request;
        }

        const info: CrawlInfo<InternalStage.Init> = {
          request,
          product,
          stage: InternalStage.Init,
          data: { [InternalStage.Init]: requestObject },
          index: 0,
        };

        this.push(info);
        callback();
      },
    });
  };

  /**
   * Creates the Fetch stream.
   * This stream processes {@link CrawlInfo} inputs and returns fetched data or errors.
   * Uses {@link ParallelTransform} for concurrency.
   * @returns The configured fetch stream.
   */
  private readonly createFetchStream = () => {
    return new PipelineTransform(
      async (info: CrawlInfo<InternalStage.Init>) => {
        // Resolve scraper configuration dynamically
        const url = info.data[InternalStage.Init].url;
        const api = this.info || (await ScraperRegistry.getScraper(url.hostname));

        // Respect scraper rate limit and delay per domain name
        const delayMs = api.delayMs !== undefined ? api.delayMs : 1000;
        if (delayMs > 0) {
          await this.rateLimiter.wait(url, delayMs);
        }

        const fetcher: FetchFunction<Fetched> =
          (api.fetch as FetchFunction<Fetched> | undefined) ||
          (defaultStealthFetch as unknown as FetchFunction<Fetched>);

        const response = await fetcher(info.data[InternalStage.Init]);

        // Cache heavy response body on disk
        let payload = "";
        if (response && typeof (response as any).text === "function") {
          payload = await (response as any).text();
        } else if (response && typeof (response as any).json === "function") {
          payload = JSON.stringify(await (response as any).json());
        } else if (response) {
          payload = String(response);
        }

        const cacheKey = `response:${info.product}:${info.index}:${Date.now()}:${Math.random()}`;
        await this.cache.set(cacheKey, payload);

        return this.createNextCrawlInfo(info, InternalStage.Fetch, cacheKey);
      },
      {
        concurrency: this.streamOptions?.concurrency ?? 10,
        highWaterMark: this.streamOptions?.highWaterMark ?? 64,
      }
    );
  };

  /**
   * Creates the Extract stream.
   * This stream runs the API's extract function.
   * It uses {@link PipelineTransform} to handle concurrency and stage transition to 'Extract'.
   * @returns The configured extract stream.
   */
  private readonly createExtractStream = () => {
    return new PipelineTransform(async (info: CrawlInfo<InternalStage.Fetch>) => {
      // Resolve scraper configuration dynamically
      const url = info.data[InternalStage.Init].url;
      const api = this.info || (await ScraperRegistry.getScraper(url.hostname));

      // Retrieve from cache
      const fetchCacheKey = info.data.fetch;
      const htmlText = await this.cache.get<string>(fetchCacheKey);

      const mockResponse = {
        text: async () => htmlText,
        json: async () => JSON.parse(htmlText),
        ok: true,
        status: 200,
      } as any;

      // Corrected arguments order: response first, info second
      const result = await api.extract(mockResponse, info);
      await this.cache.delete(fetchCacheKey);

      const { raw, next } = Array.isArray(result) ? { raw: result, next: [] } : result;

      if (next) {
        next.forEach((item: RequestOptions) => this.inputTransform.write(item));
      }

      return await Promise.all(
        raw.map(async (item, index) => {
          const extractCacheKey = `extract:${info.product}:${info.index}:${index}:${Date.now()}:${Math.random()}`;
          await this.cache.set(extractCacheKey, item);
          return this.createNextCrawlInfo(info, InternalStage.Extract, extractCacheKey);
        })
      );
    });
  };

  /**
   * Creates the Parse stream (Optional).
   * This stream runs the API's parse function if provided.
   * @returns The configured parse stream, or undefined if api.parse is irrelevant.
   */
  private readonly createParseStream = () => {
    return new PipelineTransform(async (info: CrawlInfo<InternalStage.Extract>) => {
      // Resolve scraper configuration dynamically
      const url = info.data[InternalStage.Init].url;
      const api = this.info || (await ScraperRegistry.getScraper(url.hostname));

      const extractCacheKey = info.data.extract;
      const rawData = await this.cache.get<Raw>(extractCacheKey);

      let result: Final = rawData as unknown as Final;
      if (api.parse) {
        result = (await api.parse(rawData, info)) as Final;
      }
      await this.cache.delete(extractCacheKey);

      const parseCacheKey = `parse:${info.product}:${info.index}:${Date.now()}:${Math.random()}`;
      await this.cache.set(parseCacheKey, result);
      return this.createNextCrawlInfo(info, InternalStage.Parse, parseCacheKey);
    });
  };

  /**
   * Creates the Result filter stream.
   * This is a simple {@link Transform} stream that unwraps the `CrawlInfo` object
   * to emit the final data payload (from Parse or Extract stage).
   * It is synchronous and does not use `PipelineTransform`.
   * @returns The configured result filter transform.
   */
  private readonly createResultFilter = () => {
    const self = this;
    return new Transform({
      objectMode: true,
      async transform(chunk: any, _encoding: BufferEncoding, callback: TransformCallback) {
        try {
          if (chunk && typeof chunk === "object" && !chunk.error) {
            if (chunk.stage === InternalStage.Parse || chunk.stage === InternalStage.Extract) {
              const parseKey = chunk.data[chunk.stage];
              const parsedData = await self.cache.get<any>(parseKey);
              if (process.connected) {
                this.push({ result: parsedData, info: chunk });
              } else {
                this.push(parsedData);
              }
              await self.cache.delete(parseKey);
            } else {
              this.push(chunk);
            }
          }
          callback();
        } catch (err: any) {
          callback(err);
        }
      },
    });
  };

  /**
   * Helper to initialize a stage stream and pipe it to the monitor.
   * @param createFn Function that creates the stream.
   * @returns The created and monitored stream.
   */
  private initStage<T extends NodeJS.ReadableStream>(createFn: () => T): T {
    const stream = createFn();
    stream.pipe(this.monitorStream, { end: false });
    return stream;
  }

  /**
   * Creates the next `CrawlInfo` based on the current stage and result.
   * Dynamically assigns the result to the corresponding stage key in `CrawlData`.
   * @param prev The previous `CrawlInfo`.
   * @param result The result from the process function.
   * @returns The new `CrawlInfo`.
   */
  private createNextCrawlInfo<Prev extends InternalStage, Stage extends InternalStage>(
    prev: CrawlInfo<Prev>,
    stage: Stage,
    result: CrawlData<Stage>
  ): CrawlInfo<Stage> {
    const newData: any = { ...prev.data, [stage]: result };

    return { ...prev, stage, data: newData };
  }
}

export { CrawlStream };
