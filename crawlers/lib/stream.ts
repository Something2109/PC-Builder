import {
  Duplex,
  DuplexOptions,
  TransformCallback,
  PassThrough,
  Transform,
} from "node:stream";
import {
  CrawlHandlerInterface,
  CrawlInfo,
  ErrorOutputObject,
} from "../interface";
import { ParallelTransform } from "../utils/parallel-transform";
import { PipelineTransform } from "../utils/pipeline-transform";

/**
 * The crawl stream extending the Node's {@link Duplex} class.
 * The stream acts as a wrapper for the Fetch -> Extract -> Parse pipeline.
 * It is a Duplex stream where the writable side feeds the pipeline
 * and the readable side outputs the results (and potential new crawl links).
 */
class CrawlStream<Raw, Final, Fetched> extends Duplex {
  private readonly handler: CrawlHandlerInterface<Raw, Final, Fetched>;
  public readonly monitorStream: PassThrough;

  // Pipeline stages
  private readonly fetchStream: ParallelTransform<CrawlInfo<Final>, any>;
  private readonly extractStream: PipelineTransform<
    any,
    Final | CrawlInfo<Final>
  >;
  private readonly parseStream: PipelineTransform<
    any,
    Final | CrawlInfo<Final>
  >;
  private readonly resultFilter: Transform; // Add property definition

  /**
   * Constructs a new CrawlStream.
   * @param handler The crawl handler implementation (fetch, extract, parse logic).
   * @param options Stream options and custom log path.
   */
  constructor(
    handler: CrawlHandlerInterface<Raw, Final, Fetched>,
    options?: Omit<DuplexOptions, "objectMode"> & { logPath?: string }
  ) {
    super({ objectMode: true, ...options });

    this.handler = handler;
    this.monitorStream = new PassThrough({ objectMode: true });

    // Initialize pipeline stages
    this.fetchStream = this.createFetchStream();
    this.extractStream = this.createExtractStream();
    this.parseStream = this.createParseStream();
    this.resultFilter = this.createResultFilter();

    // Wire up the pipeline: Fetch -> Extract -> Parse -> ResultFilter
    // Pipe ALL internal events from fetch/extract/parse to the aggregated monitorStream.
    // ResultFilter errors should also go to monitorStream, handled by piping ResultFilter logic?
    // Wait, ResultFilter ignores errors (calls callback).
    // We only need to pipe errors from the upstream transforms.

    this.fetchStream.pipe(this.monitorStream, { end: false });
    this.extractStream.pipe(this.monitorStream, { end: false });
    this.parseStream.pipe(this.monitorStream, { end: false });
    // ResultFilter doesn't emit errors to monitor, it swallows or checks chunks.
    // But if ResultFilter throws, we should catch it.
    this.resultFilter.on("error", (err: any) => this.emit("error", err));

    // Main data flow
    this.fetchStream
      .pipe(this.extractStream)
      .pipe(this.parseStream)
      .pipe(this.resultFilter);

    // Listen to outputs from the final filter and push them to the Duplex's readable side
    this.resultFilter.on("data", (chunk: Final) => {
      // ResultFilter only emits Final.
      if (!this.push(chunk)) {
        this.resultFilter.pause();
      }
    });

    // Handle errors from the pipeline stages
    this.fetchStream.on("error", (err) => this.emit("error", err));
    this.extractStream.on("error", (err) => this.emit("error", err));
    this.parseStream.on("error", (err) => this.emit("error", err));

    // Monitor stream error handling
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
    const handler = this.handler;

    return new (class ParallelFetch extends ParallelTransform<
      CrawlInfo<Final>,
      { info: CrawlInfo<Final>; response: Fetched } | ErrorOutputObject<Final>
    > {
      async process(info: CrawlInfo<Final>) {
        try {
          const response = await handler.fetch(info);
          this.push({ info, response });
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          const errorObj = await handler.error(info, error);
          this.push(errorObj);
        }
      }
    })({ concurrency: 10, highWaterMark: 64 });
  };

  /**
   * Creates the Extract stream.
   * This stream extracts raw items and new links from the fetched response.
   * New links are pushed back to the main stream flow (recursively or via event).
   * @returns The configured extract stream.
   */
  private readonly createExtractStream = () => {
    const handler = this.handler;

    return new (class ExtractStream extends PipelineTransform<
      { info: CrawlInfo<Final>; response: Fetched },
      Final | CrawlInfo<Final>
    > {
      async _process(
        chunk: { info: CrawlInfo<Final>; response: Fetched },
        callback: TransformCallback
      ) {
        const { info, response } = chunk;
        try {
          const { raw: list, info: links } = await handler.extract(
            info,
            response
          );

          // Push new links directly to the stream (Pipelines to ParseStream)
          links.forEach((link) => this.push(link));

          // Push raw data to the next stage (ParseStream)
          list.forEach((raw) => this.push({ info, raw }));
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          const errorObj = await handler.error(info, error);
          this.push(errorObj as any);
        } finally {
          callback();
        }
      }
    })();
  };

  /**
   * Creates the Parse stream.
   * This stream parses raw items into the Final result format.
   * It also passes through any intermediate Links found in the pipeline.
   * @returns The configured parse stream.
   */
  private readonly createParseStream = () => {
    const handler = this.handler;

    // Input can be {info, raw} OR CrawlInfo (Link)
    return new (class ParseStream extends PipelineTransform<
      { info: CrawlInfo<Final>; raw: Raw } | CrawlInfo<Final>,
      Final | CrawlInfo<Final>
    > {
      async _process(
        chunk: { info: CrawlInfo<Final>; raw: Raw } | CrawlInfo<Final>,
        callback: TransformCallback
      ) {
        // Passthrough Links
        if (chunk && typeof chunk === "object" && !("raw" in chunk)) {
          this.push(chunk);
          callback();
          return;
        }

        const { info, raw } = chunk as { info: CrawlInfo<Final>; raw: Raw };
        try {
          const result = await handler.parse(info, raw);
          this.push(result);
        } catch (err) {
          const errorObj = await handler.error(
            info,
            err instanceof Error ? err : new Error(String(err))
          );
          this.push(errorObj as any);
        } finally {
          callback();
        }
      }
    })();
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
    // Using arrow function property ensures lexical 'this'
    return new (class ResultFilter extends PipelineTransform<any, Final> {
      constructor(private readonly emitter: CrawlStream<Raw, Final, Fetched>) {
        super();
      }

      async _process(chunk: any, callback: TransformCallback) {
        // 1. Error -> Ignore (Already monitored via monitorStream piping from upstream)
        if (
          chunk instanceof Error ||
          (chunk && typeof chunk === "object" && "error" in chunk)
        ) {
          callback();
          return;
        }

        // 2. Link -> Emit event
        if (
          chunk &&
          typeof chunk === "object" &&
          "url" in chunk &&
          !("raw" in chunk) &&
          !("response" in chunk) &&
          !("info" in chunk)
        ) {
          this.emitter.emit("link", chunk);
          callback();
          return;
        }

        // 3. Result -> Push to Readable output
        this.push(chunk);
        callback();
      }
    })(this);
  };
}

export { CrawlStream };
