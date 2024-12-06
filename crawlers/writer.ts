import { Products } from "@/utils/Enum";
import { createWriteStream, existsSync, mkdirSync, WriteStream } from "fs";
import { Writable, WritableOptions } from "stream";
import path from "path";
import { OutputObject } from "./crawler";

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

    let prefix = ",";
    if (!this.writeStream[filename]) {
      this.writeStream[filename] = createWriteStream(
        path.join(this.path, `${filename}.json`),
        encoding
      );
      prefix = "[";
    }
    this.writeStream[filename].write(
      `${prefix}${JSON.stringify(chunk)}`,
      callback
    );
  }

  _final(callback: (error?: Error | null) => void): void {
    Object.values(this.writeStream).forEach((stream) => {
      stream.write("]");
      stream.end();
    });
    callback();
  }
}

class ProcessWriter extends Writable {
  constructor(options?: Omit<WritableOptions, "objectMode">) {
    super({ objectMode: true, ...options });
  }

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
