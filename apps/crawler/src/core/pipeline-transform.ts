import { Transform, TransformCallback, TransformOptions } from "node:stream";

import { ErrorObject } from "../types/interface";

/**
 * A base Transform stream that automatically filters error messages and handles concurrency.
 * It manages the transition of `CrawlInfo` between stages by updating the internal stage and data.
 * If the chunk contains an error, it is pushed through without processing.
 */
class PipelineTransform<T, Final> extends Transform {
  private readonly concurrency: number;
  private readonly processFn: (chunk: T) => Promise<Final>;
  private running: number;
  private pendingCallback: TransformCallback | null;

  constructor(
    processFn: (chunk: T) => Promise<Final>,
    options?: Omit<TransformOptions, "objectMode"> & {
      concurrency?: number;
    }
  ) {
    super({ objectMode: true, highWaterMark: 64, ...options });
    this.concurrency = options?.concurrency ?? 1;
    this.running = 0;
    this.pendingCallback = null;
    this.processFn = processFn;
  }

  _transform(
    chunk: T | ErrorObject,
    _: BufferEncoding,
    callback: TransformCallback
  ) {
    if (this.isErrorOutput(chunk)) {
      callback();
    } else {
      this.running++;
      this.process(chunk);

      if (this.running < this.concurrency) {
        callback();
      } else {
        this.pendingCallback = callback;
      }
    }
  }

  private async process(chunk: T): Promise<void> {
    try {
      const result = await this.processFn(chunk);

      if (Array.isArray(result)) {
        result.forEach((info) => this.push(info));
      } else {
        this.push(result);
      }
    } catch (error) {
      this._onError(error, chunk);
    } finally {
      this.running--;
      this.checkPending();
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

  protected _onError(error: any, chunk: T): void {
    const errorObj = {
      info: chunk,
      error: error instanceof Error ? error : new Error(String(error)),
    };
    this.push(errorObj);
  }

  private isErrorOutput(chunk: any): chunk is ErrorObject {
    return chunk && typeof chunk === "object" && "error" in chunk;
  }
}

export { PipelineTransform };
