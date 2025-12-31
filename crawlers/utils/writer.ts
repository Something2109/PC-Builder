import { Products } from "../../utils/Enum";
import { createWriteStream, existsSync, mkdirSync, WriteStream } from "node:fs";
import { Writable, WritableOptions } from "node:stream";
import path from "node:path";
import { OutputObject, BaseOutput } from "../interface";

/**
 * The write stream that write the crawl result
 * to the file detemined in the constructor.
 */
class FileWriter extends Writable {
  private readonly path: string;
  private writeStream: {
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
    chunk: OutputObject,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    // Handle Standard Output
    const {
      progress: { created, processed },
      ...rest
    } = chunk as OutputObject & BaseOutput;

    if ("result" in rest || "error" in rest) {
      const filename: keyof typeof this.writeStream =
        "error" in rest ? "error" : rest.info.product;

      // Format the error object to be easier stringify to json.
      if ("error" in rest) {
        (rest as any).error = rest.error.stack as any;
      }

      this.writeToStream(filename, rest, encoding, false);
    }

    console.log(
      `Progress: ${Object.entries(processed)
        .map(([key, value]) => {
          if (key !== "error") {
            return `${value}/${created[key as keyof typeof created]} ${key}`;
          }
          return `Error: ${value}`;
        })
        .join(", ")}`
    );

    callback();
  }

  private writeToStream(
    filename: string,
    data: any,
    encoding: BufferEncoding,
    isJsonL: boolean
  ) {
    let prefix = ",";
    const key = filename as keyof typeof this.writeStream;

    if (!this.writeStream[key]) {
      this.writeStream[key] = createWriteStream(
        path.join(this.path, `${filename}.${isJsonL ? "jsonl" : "json"}`),
        encoding
      );
      prefix = "[";
    }

    const stream = this.writeStream[key];

    if (isJsonL) {
      stream.write(JSON.stringify(data) + "\n");
    } else {
      stream.write(`${prefix}${JSON.stringify(data)}`);
    }
  }

  /**
   * Finish the writing process by end the json with the bracket
   * to create the array of object result.
   * @param callback The callback variable from the parent function.
   */
  _final(callback: (error?: Error | null) => void): void {
    Object.entries(this.writeStream).forEach(([key, stream]) => {
      // Don't close array for jsonl files
      if (key !== "failed_requests" && stream) {
        stream.end("]");
      } else if (stream) {
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
