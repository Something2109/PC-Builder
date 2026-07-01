import { Products } from "@pc-builder/shared";
import { Readable, Writable } from "node:stream";

import { StreamStorageWriter } from "../storage/storage";
import { ErrorHandler } from "../telemetry/error-handler";
import { StreamMonitor } from "../telemetry/monitor";
import { APIWebsiteInfo, CrawlStorageAdapter } from "../types/interface";
import { CrawlStream } from "./stream";

/**
 * The main crawler class.
 * The crawl process comprises many streams, each for a main crawl funtions, piped together
 * to decrease the block time of each crawl info's process affect the next one's process.
 * Should be used when dealing with large data of crawl info.
 */
class Crawler<Raw, Final = Raw, Fetched = Response> {
  private readonly info?: APIWebsiteInfo<Raw, Final, Fetched>;
  private readonly input: Readable;
  private readonly output: Writable;
  private readonly errorHandler: ErrorHandler;
  private readonly monitor?: Writable;
  private readonly sessionId?: string;

  /**
   * The crawler constructor.
   * @param info Optional website api to be used by the crawler. If omitted, scraper is resolved dynamically.
   * @param options The options for the crawler. Take output as a {@link Writable} or adapter as {@link CrawlStorageAdapter}.
   */
  constructor(
    info?: APIWebsiteInfo<Raw, Final, Fetched>,
    options?: {
      output?: Writable;
      adapter?: CrawlStorageAdapter<any>;
      errorHandler?: ErrorHandler;
      logPath?: string;
      monitor?: Writable;
      sessionId?: string;
    }
  ) {
    this.info = info;
    this.sessionId = options?.sessionId;

    this.input = new Readable({
      objectMode: true,
      read() {},
      highWaterMark: 64,
    });
    this.output =
      options?.output ??
      (options?.adapter ? new StreamStorageWriter(options.adapter) : this.createDefaultOutput());
    this.errorHandler =
      options?.errorHandler ??
      new ErrorHandler({ path: options?.logPath ?? "./logs", sessionId: this.sessionId });
    this.monitor = options?.monitor ?? new StreamMonitor({ logPath: options?.logPath ?? "./logs" });
  }
  /**
   * The crawl function.
   * Initializes the {@link CrawlStream} pipeline, connects it to input/output,
   * sets up monitoring, and starts the crawl process.
   * @param products Optional list of products to start crawling with.
   */
  async crawl(products?: Products[]) {
    const crawlStream = new CrawlStream(this.info, { sessionId: this.sessionId });

    // 1. Input Piping
    this.input.pipe(crawlStream, { end: false });

    // 2. Output Piping
    // CrawlStream readable side now only emits successful results (Final).
    crawlStream.pipe(this.output, { end: false });

    // 3. Link Handling (Recycle links)
    crawlStream.on("link", (link) => {
      this.input.push(link);
    });

    // 4. Monitoring & Error Handling
    if (this.monitor) {
      crawlStream.monitorStream.pipe(this.monitor, { end: false });
    }
    crawlStream.monitorStream.pipe(this.errorHandler, { end: false });

    // 5. Error propagation
    crawlStream.on("error", (err) => {
      // Log fatal stream errors if needed
      console.error(err);
    });

    // Start with seeds
    this.start(products);
  }

  /**
   * Generates initial crawl infos and pushes them to the input stream.
   * @param products List of products to crawl.
   */
  private start(products?: Products[]) {
    if (!this.info?.path) return;

    const getPath = this.info?.path;

    products ??= this.info.supportedProducts ?? Object.values(Products);

    products.forEach((product) => {
      // Default to page 1 for now
      const requestOptions = getPath(product, 1);

      if (requestOptions) {
        this.input.push(requestOptions);
      }
    });
  }

  /**
   * Create a writable stream that write the {@link ParseResult}
   * to the {@link process.stdout} stream.
   * @returns The created output stream.
   */
  private createDefaultOutput() {
    return new Writable({
      objectMode: true,
      write(chunk: any, _, callback) {
        if (chunk && typeof chunk === "object" && "error" in chunk) {
          callback();
          return;
        }
        const str = JSON.stringify(chunk);
        process.stdout.write(str + "\n", callback);
      },
    });
  }
}

export { Crawler };
