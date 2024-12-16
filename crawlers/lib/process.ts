import fs from "fs";
import path from "path";
import { ChildProcess, fork } from "child_process";
import { Products } from "../../utils/Enum";
import { isCrawlInfo, OutputObject } from "../interface";

class CrawlerChildProcess {
  private path: string;
  private process: ChildProcess | null;
  private summary?: {
    [key in Products]?: number;
  } & { error?: number };

  constructor(filepath: string) {
    this.path = this.pathResolver(filepath);
    this.process = null;
  }

  /**
   * Start the crawling process
   * by create the child process responsible
   * for crawling data and send it to the main process
   * by the IPC channel.
   * @param products The product list to crawl data from.
   * @returns The boolean stating the success state of creating process.
   */
  start(products?: Products[]): boolean {
    if (this.process) {
      return false;
    }
    if (!products) {
      products = Object.values(Products);
    }

    this.process = fork(__dirname, [
      "--path",
      this.path,
      "--product",
      ...products,
    ])
      .on("message", (chunk: OutputObject) => this.productCount(chunk))
      .on("exit", () => {
        this.process = null;

        console.log(
          `Crawled ${Object.entries(this.summary!)
            .map(([product, count]) => `${count} ${product}`)
            .join(", ")}`
        );

        this.summary = undefined;
      });

    return this.isCrawling();
  }

  /**
   * Determine if currently there is a crawl process running.
   * @returns The boolean stating the process.
   */
  isCrawling(): boolean {
    return this.process !== null;
  }

  /**
   * Stop the current crawl process.
   * @returns The boolean determine if the process stops successfully.
   */
  stop(): boolean {
    if (!this.process) {
      return false;
    }

    this.process.kill("SIGINT");

    return this.process.killed;
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
   * Count the product output received from the crawler.
   * @param chunk The output received from the crawler.
   */
  private productCount({ product, ...chunk }: OutputObject) {
    if (!this.summary) {
      this.summary = {};
    }

    const productType = "error" in chunk ? "error" : product;

    if (!this.summary[productType]) {
      this.summary[productType] = 0;
    }

    this.summary[productType]++;
  }
}

export { CrawlerChildProcess };
