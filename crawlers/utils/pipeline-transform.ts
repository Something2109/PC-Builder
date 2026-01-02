import { Transform, TransformCallback, TransformOptions } from "node:stream";
import { ErrorOutputObject, CrawlInfo } from "../interface";

/**
 * A base Transform stream that automatically filters error messages.
 * If the chunk contains an error, it is pushed through without processing.
 */
class PipelineTransform<T, Final> extends Transform {
  private readonly processFn: (chunk: T) => Promise<void>;

  constructor(
    processFn: (chunk: T) => Promise<void>,
    options?: Omit<TransformOptions, "objectMode">
  ) {
    super({ objectMode: true, highWaterMark: 64, ...options });
    this.processFn = processFn;
  }

  _transform(
    chunk: T | ErrorOutputObject<Final>,
    _: BufferEncoding,
    callback: TransformCallback
  ) {
    if (this.isErrorOutput(chunk)) {
      callback();
    } else {
      this.processFn(chunk)
        .catch((error) => this._onError(error, chunk))
        .finally(callback);
    }
  }

  protected _onError(error: any, chunk: T): void {
    const errorObj: ErrorOutputObject<Final> = {
      progress: {
        created: {} as any, // Dummy progress
        processed: {} as any,
      },
      info: chunk as unknown as CrawlInfo, // Cast chunk to CrawlInfo
      error: error instanceof Error ? error : new Error(String(error)),
    };
    this.push(errorObj);
  }

  private isErrorOutput(chunk: any): chunk is ErrorOutputObject<Final> {
    return chunk && typeof chunk === "object" && "error" in chunk;
  }
}

export { PipelineTransform };
