import {
  Duplex,
  DuplexOptions,
  PassThrough,
  pipeline,
  Transform,
  TransformCallback,
} from "node:stream";
import {
  APIWebsiteInfo,
  CrawlInfo,
  FetchFunction,
  InternalStage,
} from "../interface";
import { PipelineTransform } from "../utils/pipeline-transform";

/**
 * The crawl stream extending the Node's {@link Duplex} class.
 * The stream acts as a wrapper for the Fetch -> Extract -> Parse pipeline.
 * It is a Duplex stream where the writable side feeds the pipeline (init stage)
 * and the readable side outputs the final results.
 * It uses {@link PipelineTransform} for async stages to manage concurrency and state,
 * and standard {@link Transform} for synchronous post-processing.
 */
class CrawlStream<Raw, Final = Raw, Fetched = Response> extends Duplex {
  private readonly info: APIWebsiteInfo<Raw, Final, Fetched>;
  public readonly monitorStream: PassThrough;

  // Pipeline stages
  private readonly fetchStream: PipelineTransform<
    CrawlInfo<InternalStage.Init, Raw, Final, Fetched>,
    CrawlInfo<InternalStage.Fetch, Raw, Final, Fetched>
  >;
  private readonly extractStream: PipelineTransform<
    CrawlInfo<InternalStage.Fetch, Raw, Final, Fetched>,
    CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>
  >;
  private readonly parseStream?: PipelineTransform<
    CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>,
    CrawlInfo<InternalStage.Parse, Raw, Final, Fetched>
  >;
  private readonly resultFilter: Transform;
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
    info: APIWebsiteInfo<Raw, Final, Fetched>,
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

    // Initialize pipeline stages
    this.fetchStream = this.initStage(this.createFetchStream);
    this.extractStream = this.initStage(this.createExtractStream);
    this.resultFilter = this.createResultFilter();

    const streams: PipelineTransform<any, any>[] = [
      this.fetchStream,
      this.extractStream,
    ];

    if (this.info.parse) {
      this.parseStream = this.initStage(this.createParseStream);
      streams.push(this.parseStream);
    }

    // Use pipeline for error propagation and cleanup
    pipeline([...streams, this.resultFilter], (err) => {
      if (err) this.emit("error", err);
    });

    // Listen to outputs from the final filter and push them to the Duplex's readable side
    this.resultFilter.on("data", (chunk: any) => {
      if (!this.push(chunk)) {
        this.resultFilter.pause();
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
  _write(
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    if (this.fetchStream.write(chunk, encoding)) {
      callback();
    } else {
      this.fetchStream.once("drain", callback);
    }
  }

  /**
   * Finalizes the stream.
   * Ends the internal `fetchStream`, which triggers a cascade of endings through the pipeline.
   * @param callback Callback when finalization is complete.
   */
  _final(callback: (error?: Error | null) => void): void {
    this.fetchStream.end(() => {
      callback();
    });
  }

  /**
   * Reads data from the stream (output from the pipeline).
   * Resumes the `resultFilter` if it was paused.
   * @param size Number of bytes to read (ignored for object mode).
   */
  _read(size: number): void {
    // Resume pipeline if it was paused
    if (this.resultFilter.isPaused()) {
      this.resultFilter.resume();
    }
  }

  /**
   * Creates the Fetch stream.
   * This stream processes {@link CrawlInfo} inputs and returns fetched data or errors.
   * Uses {@link ParallelTransform} for concurrency.
   * @returns The configured fetch stream.
   */
  private readonly createFetchStream = () => {
    const api = this.info;

    return new PipelineTransform<
      CrawlInfo<InternalStage.Init, Raw, Final, Fetched>,
      CrawlInfo<InternalStage.Fetch, Raw, Final, Fetched>
    >(
      async (info: CrawlInfo<InternalStage.Init, Raw, Final, Fetched>) => {
        // Default fetch if not provided
        const fetcher: FetchFunction<Fetched> =
          api.fetch ||
          (async (req) => {
            const res = await fetch(req.url, req);
            if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
            return res as unknown as Fetched;
          });

        return await fetcher(info.request);
      },
      InternalStage.Fetch,
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
    const api = this.info;

    return new PipelineTransform<
      CrawlInfo<InternalStage.Fetch, Raw, Final, Fetched>,
      CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>
    >(async (info: CrawlInfo<InternalStage.Fetch, Raw, Final, Fetched>) => {
      return await api.extract(info, info.data.fetch);
    }, InternalStage.Extract);
  };

  /**
   * Creates the Parse stream (Optional).
   * This stream runs the API's parse function if provided.
   * @returns The configured parse stream, or undefined if api.parse is irrelevant.
   */
  private readonly createParseStream = () => {
    const api = this.info;

    return new PipelineTransform<
      CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>,
      CrawlInfo<InternalStage.Parse, Raw, Final, Fetched>
    >(async (info: CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>) => {
      let result: Final = info.data.extract as unknown as Final;
      if (api.parse) {
        result = await api.parse(info.data.extract, info);
      }
      return result;
    }, InternalStage.Parse);
  };

  /**
   * Creates the Result filter stream.
   * This is a simple {@link Transform} stream that unwraps the `CrawlInfo` object
   * to emit the final data payload (from Parse or Extract stage).
   * It is synchronous and does not use `PipelineTransform`.
   * @returns The configured result filter transform.
   */
  private readonly createResultFilter = () => {
    return new Transform({
      objectMode: true,
      transform(
        chunk: any,
        _encoding: BufferEncoding,
        callback: TransformCallback
      ) {
        if (!chunk?.error) {
          if (chunk.stage === InternalStage.Parse) {
            this.push(chunk.data.parse);
          } else {
            this.push(chunk.data.extract);
          }
        }

        callback();
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
}

export { CrawlStream };
