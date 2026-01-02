import { Duplex, DuplexOptions, PassThrough, Transform } from "node:stream";
import {
  APIWebsiteInfo,
  CrawlInfo,
  ErrorOutputObject,
  FetchFunction,
  InternalStage,
} from "../interface";
import { ParallelTransform } from "../utils/parallel-transform";
import { PipelineTransform } from "../utils/pipeline-transform";

/**
 * The crawl stream extending the Node's {@link Duplex} class.
 * The stream acts as a wrapper for the Fetch -> Extract -> Parse pipeline.
 * It is a Duplex stream where the writable side feeds the pipeline
 * and the readable side outputs the results (and potential new crawl links).
 */
class CrawlStream<Raw, Final = Raw, Fetched = Response> extends Duplex {
  private readonly info: APIWebsiteInfo<Raw, Final, Fetched>;
  public readonly monitorStream: PassThrough;

  // Pipeline stages
  private readonly fetchStream: ParallelTransform<
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
  private readonly resultFilter: PipelineTransform<
    | CrawlInfo<InternalStage.Parse, Raw, Final, Fetched>
    | CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>,
    Final
  >;

  /**
   * Constructs a new CrawlStream.
   * @param info The website info implementation (fetch, extract, parse logic).
   * @param options Stream options and custom log path.
   */
  constructor(
    info: APIWebsiteInfo<Raw, Final, Fetched>,
    options?: Omit<DuplexOptions, "objectMode"> & { logPath?: string }
  ) {
    super({ objectMode: true, ...options });

    this.info = info;
    this.monitorStream = new PassThrough({ objectMode: true });

    // Initialize pipeline stages
    this.fetchStream = this.createFetchStream();
    this.extractStream = this.createExtractStream();
    this.resultFilter = this.createResultFilter();

    if (this.info.parse) {
      this.parseStream = this.createParseStream();
    }

    // Wire up the pipeline: Fetch -> Extract -> [Parse] -> ResultFilter
    // Pipe internal events to monitorStream where appropriate
    this.fetchStream.pipe(this.monitorStream, { end: false });
    this.extractStream.pipe(this.monitorStream, { end: false });

    // Main data flow
    let tail: any = this.fetchStream.pipe(this.extractStream);

    if (this.parseStream) {
      tail = tail.pipe(this.parseStream);
      this.parseStream.on("error", (err) => this.emit("error", err));
      this.parseStream.pipe(this.monitorStream, { end: false });
    }

    tail.pipe(this.resultFilter);

    // Listen to outputs from the final filter and push them to the Duplex's readable side
    this.resultFilter.on("data", (chunk: any) => {
      if (!this.push(chunk)) {
        this.resultFilter.pause();
      }
    });

    // Handle errors logic
    const errorHandler = (err: Error) => this.emit("error", err);
    this.fetchStream.on("error", errorHandler);
    this.extractStream.on("error", errorHandler);
    // parseStream error listener added conditionally above
    this.resultFilter.on("error", errorHandler);
    this.monitorStream.on("error", errorHandler);
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

    return new ParallelTransform<
      CrawlInfo<InternalStage.Init, Raw, Final, Fetched>,
      CrawlInfo<InternalStage.Fetch, Raw, Final, Fetched>
    >(
      async (info: CrawlInfo<InternalStage.Init, Raw, Final, Fetched>) => {
        try {
          // Default fetch if not provided
          const fetcher: FetchFunction<Fetched> =
            api.fetch ||
            (async (req) => {
              const res = await fetch(req.url, req);
              if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
              return res as unknown as Fetched;
            });

          const response = await fetcher(info.request);

          // Create new info for next stage
          const nextInfo: CrawlInfo<InternalStage.Fetch, Raw, Final, Fetched> =
            {
              ...info,
              stage: InternalStage.Fetch,
              data: { ...info.data, fetch: response }, // fetch is now typed
              index: info.index, // Maintain index
              product: info.product,
            };

          this.push(nextInfo);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          // Wrap error in ErrorOutputObject
          const errorObj: ErrorOutputObject<Final> = {
            progress: {
              created: {} as any,
              processed: {} as any,
            },
            info,
            error,
          };
          this.push(errorObj);
        }
      },
      { concurrency: 10, highWaterMark: 64 }
    );
  };

  /**
   * Creates the Extract stream.
   * This stream extracts raw items and new links from the fetched response.
   * New links are pushed back to the main stream flow (recursively or via event).
   * @returns The configured extract stream.
   */
  private readonly createExtractStream = () => {
    const api = this.info;

    return new PipelineTransform<
      CrawlInfo<InternalStage.Fetch, Raw, Final, Fetched>,
      CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>
    >(async (info: CrawlInfo<InternalStage.Fetch, Raw, Final, Fetched>) => {
      const rawList = await api.extract(info, info.data.fetch);

      rawList.forEach((raw, index) => {
        const nextInfo: CrawlInfo<InternalStage.Extract, Raw, Final, Fetched> =
          {
            ...info,
            stage: InternalStage.Extract,
            data: { ...info.data, extract: raw },
            index: index, // Set new index
            product: info.product,
          };
        this.push(nextInfo);
      });
    });
  };

  /**
   * Creates the Parse stream.
   * This stream parses raw items into the Final result format.
   * It also passes through any intermediate Links found in the pipeline.
   * @returns The configured parse stream.
   */
  private readonly createParseStream = () => {
    const api = this.info;

    return new PipelineTransform<
      CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>,
      CrawlInfo<InternalStage.Parse, Raw, Final, Fetched>
    >(async (info: CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>) => {
      let result: Final;
      if (api.parse) {
        result = await api.parse(info.data.extract, info);
      } else {
        result = info.data.extract as unknown as Final;
      }

      const nextInfo: CrawlInfo<InternalStage.Parse, Raw, Final, Fetched> = {
        ...info,
        stage: InternalStage.Parse,
        data: { ...info.data, parse: result },
        index: info.index,
        product: info.product,
      };
      this.push(nextInfo);
    });
  };

  /**
   * Creates the Result Filter stream.
   * This is the final stage of the pipeline.
   * It splits the stream:
   * - Results -> Pushed to output (Readable side)
   * - Links -> Emitted as 'link' events (removed from output)
   * - Errors -> Ignored (removed from output, already handled by monitor)
   * @returns The configured result filter transform.
   */
  private readonly createResultFilter = () => {
    return new PipelineTransform<
      | CrawlInfo<InternalStage.Parse, Raw, Final, Fetched>
      | CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>,
      Final
    >(
      async (
        chunk:
          | CrawlInfo<InternalStage.Parse, Raw, Final, Fetched>
          | CrawlInfo<InternalStage.Extract, Raw, Final, Fetched>
      ) => {
        if (chunk.stage === InternalStage.Parse) {
          this.push(chunk.data.parse);
        } else {
          this.push(chunk.data.extract);
        }
      }
    );
  };
}

export { CrawlStream };
