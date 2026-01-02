import { Transform, TransformCallback } from "node:stream";

/**
 * A specialized Transform stream that processes chunks in parallel
 * up to a specified concurrency limit.
 */
class ParallelTransform<T, R> extends Transform {
  private readonly concurrency: number;
  private readonly processFn: (chunk: T) => Promise<void>;
  private running: number;
  private pendingCallback: TransformCallback | null;

  constructor(
    processFn: (chunk: T) => Promise<void>,
    options?: { concurrency?: number; highWaterMark?: number }
  ) {
    super({ objectMode: true, highWaterMark: options?.highWaterMark });
    this.concurrency = options?.concurrency ?? 5;
    this.running = 0;
    this.pendingCallback = null;
    this.processFn = processFn;
  }

  _transform(chunk: T, _encoding: BufferEncoding, callback: TransformCallback) {
    this.running++;
    this.processFn(chunk)
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
}

export { ParallelTransform };
