import { Products } from "../../utils/Enum";
import { Readable, Writable } from "node:stream";
import { CrawlHandlerInterface, OutputObject } from "../interface";
import { ErrorHandler } from "../utils/error-handler";
import { StreamMonitor } from "../utils/monitor";
import { CrawlStream } from "./stream";

/**
 * The main crawler class.
 * The crawl process comprises many streams, each for a main crawl funtions, piped together
 * to decrease the block time of each crawl info's process affect the next one's process.
 * Should be used when dealing with large data of crawl info.
 */
class Crawler<Raw, Final, Fetched = Response> {
  private readonly handler: CrawlHandlerInterface<Raw, Final, Fetched>;
  private readonly input: Readable;
  private readonly output: Writable;
  private readonly autoEnd: boolean;
  private readonly errorHandler: ErrorHandler;
  private readonly monitor?: Writable;

  /**
   * The crawler constructor.
   * @param info The website api to be used by the crawler.
   * @param options The options for the crawler. Take output as a {@link Writable}
   * to customize the output of the crawler.
   * The output's write function's chunk parameter must implement the {@link OutputObject}
   * to work properly.
   * Take auto as a boolean to determine if it automatically close the crawler when finish crawling.
   */
  constructor(
    handler: CrawlHandlerInterface<Raw, Final, Fetched>,
    options?: {
      output?: Writable;
      autoEnd?: boolean;
      errorHandler?: ErrorHandler;
      logPath?: string;
      monitor?: Writable;
    }
  ) {
    this.handler = handler;

    this.input = new Readable({
      objectMode: true,
      read() {},
      highWaterMark: 64,
    });
    this.output = options?.output ?? this.createDefaultOutput();
    this.autoEnd = options?.autoEnd ?? false;
    this.errorHandler =
      options?.errorHandler ??
      new ErrorHandler({ path: options?.logPath ?? "./logs" });
    this.monitor =
      options?.monitor ??
      new StreamMonitor({ logPath: options?.logPath ?? "./logs" });
  }
  /**
   * The crawl function.
   * Initializes the {@link CrawlStream} pipeline, connects it to input/output,
   * sets up monitoring, and starts the crawl process.
   * @param products Optional list of products to start crawling with.
   */
  async crawl(products?: Products[]) {
    const crawlStream = new CrawlStream(this.handler);

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

    // 5. Finish Trigger
    // Monitor stream events are a good proxy for activity.
    crawlStream.monitorStream.on("data", () => this.finish());

    // 6. Error propagation
    crawlStream.on("error", (err) => {
      // Errors are already piped to errorHandler via monitorStream usually,
      // but if CrawlStream itself emits error (e.g. pipeline breakage), we might want to log it.
      // However, monitorStream handles pipeline errors.
      // We can rely on that.
    });

    this.handler.start(products).forEach((info) => {
      this.input.push(info);
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
      write(chunk: OutputObject<Final>, _, callback) {
        if ("error" in chunk) {
          callback();
          return;
        }
        const str = JSON.stringify(chunk);
        process.stdout.write(str + "\n", callback);
      },
    });
  }

  /**
   * Check if the crawler has finished crawling by
   * comparing the created and the processed counter
   * if they are equal or not.
   * If finished, close the {@link output}.
   */
  private finish() {
    if (this.handler.finish() && this.autoEnd) {
      this.output.write({
        progress: {
          created: this.handler.created,
          processed: this.handler.processed,
        },
      });
      this.input.push(null);
      this.errorHandler.end();
    }
  }
}

export { Crawler };
