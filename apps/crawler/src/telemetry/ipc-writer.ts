import { Writable, WritableOptions } from "node:stream";

/**
 * The write stream that sends the crawl result
 * to the parent process via Node IPC.
 */
export class ProcessWriter extends Writable {
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
