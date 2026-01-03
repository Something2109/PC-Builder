import fs from "node:fs";
import path from "node:path";
import { ChildProcess, fork } from "node:child_process";
import { Products } from "../../utils/Enum";
import { CrawlInfo, isCrawlInfo, InternalStage } from "../interface";

type ProgressInfo = {
  created: Record<InternalStage, number>;
  processed: Record<InternalStage | "error", number>;
};

type OutputObject = {
  progress: ProgressInfo;
  info?: CrawlInfo;
  result?: any;
  error?: Error;
};

enum CrawlState {
  IDLE = "idle",
  CRAWLING = "crawling",
}

type ChildProcessState = {
  state: CrawlState;
  progress: ProgressInfo | null;
};

type ChillProcessStartOptions = {
  products: Products[];
};

type CrawlerChildProcessOptions = {
  log?: (msg: string) => void;
  output?: (result: any) => void;
  error?: (error: Error) => void;
};

const EXEC_DIRECTORY = path.dirname(__dirname);
const DEFAULT_LOG_FUNCTION = (msg: string) =>
  console.log(`[${new Date().toISOString()}]: ${msg}`);
const DEFAULT_OUTPUT_FUNCTION = (result: any) => console.log(result);
const DEFAULT_ERROR_FUNCTION = (error: Error, info?: CrawlInfo<any>) => {
  const errorMsg = error.stack
    ? error.stack
    : `${error.name}: ${error.message}`;

  console.error(
    `[${new Date().toISOString()}]: ${errorMsg}\n\tWhen crawling: ${
      info?.data?.[InternalStage.Init]?.url
    }`
  );
};

class CrawlerChildProcess {
  private readonly path: string;
  private process: ChildProcess | null;
  private progress: ProgressInfo | null;
  private summary?: { [key in Products | "error"]?: number };
  private readonly resolver: {
    log: (msg: string) => void;
    output: (result: any, info?: CrawlInfo<any>) => void;
    error: (error: Error, info?: CrawlInfo<any>) => void;
  };

  constructor(filepath: string, options?: CrawlerChildProcessOptions) {
    this.path = this.pathResolver(filepath);
    this.process = null;
    this.progress = null;
    this.resolver = {
      log: options?.log ?? DEFAULT_LOG_FUNCTION,
      output: options?.output ?? DEFAULT_OUTPUT_FUNCTION,
      error: options?.error ?? DEFAULT_ERROR_FUNCTION,
    };
  }

  /**
   * Start the crawling process
   * by create the child process responsible
   * for crawling data and send it to the main process
   * by the IPC channel.
   * @param products The product list to crawl data from.
   * @returns The boolean stating the success state of creating process.
   */
  start(options?: ChillProcessStartOptions): ChildProcessState {
    if (this.state !== CrawlState.CRAWLING) {
      const args = this.argumentResolver(options);

      this.process = fork(EXEC_DIRECTORY, args)
        .on("message", (chunk: OutputObject) => this.outputResolver(chunk))
        .on("exit", () => {
          this.process = null;

          this.resolver.log(
            `Crawled ${Object.entries(this.summary!)
              .map(([product, count]) => `${count} ${product}`)
              .join(", ")} from ${path.basename(this.path, ".js")}`
          );

          this.summary = undefined;
        });
    }

    return this.status();
  }

  /**
   * Get the current status of the crawl process.
   */
  status(): ChildProcessState {
    return {
      state: this.state,
      progress: this.progress,
    };
  }

  /**
   * Stop the current crawl process.
   * @returns The boolean determine if the process stops successfully.
   */
  stop(): ChildProcessState {
    this.process?.kill("SIGINT");

    return this.status();
  }

  /**
   * Determine the current state of the crawl process.
   * @returns The boolean stating the process.
   */
  get state(): CrawlState {
    return this.process ? CrawlState.CRAWLING : CrawlState.IDLE;
  }

  /**
   * Check the existence of the given file path
   * and the validity of the file content that
   * implements the website api or not.
   * @param filepath The file path to the file.
   * Can be absolute or relative path
   * (relative path is processed according
   * to the working directory of the process).
   * @returns The path processed by the function.
   */
  private pathResolver(filepath: string) {
    if (!filepath.endsWith(".js")) {
      throw new Error(`The info path is not the compatible file: ${filepath}`);
    }

    if (!path.isAbsolute(filepath)) {
      filepath = path.join(process.cwd(), filepath);
    }

    if (!fs.existsSync(filepath)) {
      throw new Error(`Cannot find crawl info file: ${filepath}`);
    }

    const info = require(filepath).default;
    if (!isCrawlInfo(info)) {
      throw new Error(
        `The object in the file is not implemented the crawler Website API.`
      );
    }

    return filepath;
  }

  /**
   * Create the arguments to create the crawler child process object.
   * @param products The product crawl list.
   * @param options The options to create the crawler.
   * @returns The string list of argument to be passed.
   */
  private argumentResolver(options?: ChillProcessStartOptions): string[] {
    let products = options?.products;
    products ??= Object.values(Products);

    const args = ["--path", this.path, "--product", ...products];

    return args;
  }

  /**
   * Count the product output received from the crawler.
   * @param chunk The output received from the crawler.
   */
  private outputResolver({ progress, ...chunk }: OutputObject) {
    this.progress = progress;

    if (!("result" in chunk) && !("error" in chunk)) return;

    if ("result" in chunk) {
      this.resolver.output(chunk.result, chunk.info);
    }

    if (chunk.error) {
      this.resolver.error(chunk.error, chunk.info);
    }

    const productType =
      "error" in chunk ? "error" : (chunk.info?.product as Products);

    this.summary ??= {};

    if (!this.summary[productType]) {
      this.summary[productType] = 0;
    }

    this.summary[productType]++;
  }
}

export { CrawlerChildProcess, type ChildProcessState };
