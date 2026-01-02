import { Writable, WritableOptions } from "node:stream";
import { createWriteStream, WriteStream, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { ErrorObject } from "../interface";

export class ErrorHandler extends Writable {
  private readonly logStream: WriteStream;

  constructor(options: WritableOptions & { path: string }) {
    super({ objectMode: true, ...options });
    if (!existsSync(options.path)) {
      mkdirSync(options.path, { recursive: true });
    }
    this.logStream = createWriteStream(
      path.join(options.path, "failed_requests.jsonl"),
      { flags: "a" } // Append mode
    );
  }

  _write(
    chunk: ErrorObject,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    if (chunk?.error) {
      const logEntry = {
        ...chunk,
        error: {
          name: chunk.error.name,
          message: chunk.error.message,
          stack: chunk.error.stack,
        },
      };
      this.logStream.write(JSON.stringify(logEntry) + "\n", callback);
    } else {
      callback();
    }
  }

  _final(callback: (error?: Error | null) => void): void {
    this.logStream.end(callback);
  }
}
