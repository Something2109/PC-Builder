import { Transform, TransformCallback, TransformOptions } from "node:stream";
import { ErrorOutputObject } from "../interface";

/**
 * A base Transform stream that automatically filters error messages.
 * If the chunk contains an error, it is pushed through without processing.
 */
abstract class PipelineTransform<T, Final> extends Transform {
  constructor(options?: TransformOptions) {
    super({ objectMode: true, highWaterMark: 64, ...options });
  }

  _transform(
    chunk: T | ErrorOutputObject<Final>,
    _: BufferEncoding,
    callback: TransformCallback
  ) {
    if (this.isErrorOutput(chunk)) {
      this._onBypass(chunk);
      callback();
    } else {
      this._process(chunk, callback);
    }
  }

  abstract _process(
    chunk: T,
    callback: TransformCallback
  ): void | Promise<void>;

  protected _onBypass(chunk: ErrorOutputObject<Final>): void {
    // Override this method to handle bypass logic
  }

  private isErrorOutput(chunk: any): chunk is ErrorOutputObject<Final> {
    return chunk && typeof chunk === "object" && "error" in chunk;
  }
}

export { PipelineTransform };
