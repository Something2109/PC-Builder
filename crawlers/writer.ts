import { Products } from "@/utils/Enum";
import { createWriteStream, existsSync, mkdirSync, WriteStream } from "fs";
import { Writable, WritableOptions } from "stream";
import path from "path";
import { OutputObject } from "./crawler";

/**
 * The write stream that write the crawl result
 * to the file detemined in the constructor.
 */
class FileWriter extends Writable {
  private path: string;
  private writeStream: {
    [key in Products]?: WriteStream;
  } & { error?: WriteStream };

  constructor(options: Omit<WritableOptions, "objectMode"> & { path: string }) {
    super({ objectMode: true, ...options });

    this.writeStream = {};
    if (!existsSync(options.path)) {
      mkdirSync(options.path);
    }
    this.path = options.path;
  }

  /**
   * Inherited from the writable class.
   * Clasify the result by the product type and
   * the success of the crawl process and write to the corresponding file.
   * @param chunk The output of the crawl process.
   * @param encoding The encoding variable of the write function.
   * @param callback The callback variable of the write function.
   */
  _write(
    chunk: OutputObject,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    const filename: keyof typeof this.writeStream = chunk.error
      ? "error"
      : chunk.product;

    if (chunk.error) {
      chunk.error = chunk.error.stack as any;
    }

    let prefix = ","; // used to format the output according to the json format
    if (!this.writeStream[filename]) {
      this.writeStream[filename] = createWriteStream(
        path.join(this.path, `${filename}.json`),
        encoding
      );
      prefix = "["; // start of the wri
    }
    this.writeStream[filename].write(
      `${prefix}${JSON.stringify(chunk)}`,
      callback
    );
  }

  /**
   * Finish the writing process by end the json with the bracket
   * to create the array of object result.
   * @param callback The callback variable from the parent function.
   */
  _final(callback: (error?: Error | null) => void): void {
    Object.values(this.writeStream).forEach((stream) => {
      stream.write("]");
      stream.end();
    });
    callback();
  }
}

/**
 * The write stream that send the crawl result
 * to the parent process.
 */
class ProcessWriter extends Writable {
  constructor(options?: Omit<WritableOptions, "objectMode">) {
    super({ objectMode: true, ...options });
  }

  /**
   * Send the output object to the parent process.
   * @param chunk The output of the crawl process.
   * @param encoding The encoding variable of the write function.
   * @param callback The callback variable of the write function.
   */
  _write(
    chunk: OutputObject,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    if (process.send) {
      process.send(chunk, undefined, undefined, callback);
    }
  }
}

export { FileWriter, ProcessWriter };
