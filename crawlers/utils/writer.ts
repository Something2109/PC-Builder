import { Products } from "../../utils/Enum";
import { createWriteStream, existsSync, mkdirSync, WriteStream } from "node:fs";
import { Writable, WritableOptions } from "node:stream";
import path from "node:path";

/**
 * The write stream that write the crawl result
 * to the file detemined in the constructor.
 */
class FileWriter extends Writable {
  private readonly path: string;
  private readonly writeStream: {
    [key in Products]?: WriteStream;
  } & { error?: WriteStream; failed_requests?: WriteStream };

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
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    if (chunk && typeof chunk === "object" && !("error" in chunk)) {
      // Try to determine product from chunk if possible, otherwise use 'result'
      const filename: string = chunk.product || "result";
      this.writeToStream(filename, chunk, encoding);
    }
    callback();
  }

  private writeToStream(filename: string, data: any, encoding: BufferEncoding) {
    const key = filename as keyof typeof this.writeStream;

    this.writeStream[key] ??= createWriteStream(
      path.join(this.path, `${filename}.jsonl`),
      encoding
    );

    const stream = this.writeStream[key];

    stream.write(JSON.stringify(data) + "\n");
  }

  /**
   * Finish the writing process by end the json with the bracket
   * to create the array of object result.
   * @param callback The callback variable from the parent function.
   */
  _final(callback: (error?: Error | null) => void): void {
    Object.entries(this.writeStream).forEach(([key, stream]) => {
      if (stream) {
        stream.end();
      }
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
    chunk: any,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    if (process.send) {
      process.send(chunk, undefined, undefined, callback);
    } else {
      callback();
    }
  }
}

export { FileWriter, ProcessWriter };
