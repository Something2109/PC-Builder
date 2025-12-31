import { Transform, TransformCallback } from "node:stream";

/**
 * A specialized Transform stream that processes chunks in parallel
 * up to a specified concurrency limit.
 */
abstract class ParallelTransform<T, R> extends Transform {
  private readonly concurrency: number;
  private running: number;
  private pendingCallback: TransformCallback | null;

  constructor(options: { concurrency: number; highWaterMark?: number }) {
    super({ objectMode: true, highWaterMark: options.highWaterMark });
    this.concurrency = options.concurrency;
    this.running = 0;
    this.pendingCallback = null;
  }

  _transform(chunk: T, _encoding: BufferEncoding, callback: TransformCallback) {
    this.running++;
    this.process(chunk)
      .catch((err) => {
        this.emit("error", err);
      })
      .finally(() => {
        this.running--;
        this.checkPending();
      });

    if (this.running < this.concurrency) {
      callback();
    } else {
      this.pendingCallback = callback;
    }
  }

  _flush(callback: TransformCallback) {
    const check = () => {
      if (this.running === 0) {
        callback();
      } else {
        setImmediate(check);
      }
    };
    check();
  }

  private checkPending() {
    if (this.pendingCallback && this.running < this.concurrency) {
      const cb = this.pendingCallback;
      this.pendingCallback = null;
      cb();
    }
  }

  abstract process(chunk: T): Promise<void>;
}

export { ParallelTransform };
