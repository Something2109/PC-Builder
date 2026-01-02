import { Transform, TransformCallback, TransformOptions } from "node:stream";
import { ErrorObject, CrawlInfo, InternalStage } from "../interface";

/**
 * A base Transform stream that automatically filters error messages.
 * If the chunk contains an error, it is pushed through without processing.
 */
class PipelineTransform<T, Final> extends Transform {
  private readonly concurrency: number;
  private readonly stage: InternalStage;
  private readonly processFn: (chunk: T) => Promise<any>;
  private running: number;
  private pendingCallback: TransformCallback | null;

  constructor(
    processFn: (chunk: T) => Promise<any>,
    stage: InternalStage,
    options?: Omit<TransformOptions, "objectMode"> & {
      concurrency?: number;
    }
  ) {
    super({ objectMode: true, highWaterMark: 64, ...options });
    this.concurrency = options?.concurrency ?? 1;
    this.stage = stage;
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

      const nextInfo = this.createNextCrawlInfo(
        chunk as unknown as CrawlInfo,
        result
      );
      if (Array.isArray(nextInfo)) {
        nextInfo.forEach((info) => this.push(info));
      } else {
        this.push(nextInfo);
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
    const errorObj: ErrorObject = {
      info: chunk as unknown as CrawlInfo, // Cast chunk to CrawlInfo
      error: error instanceof Error ? error : new Error(String(error)),
    };
    this.push(errorObj);
  }

  private createNextCrawlInfo(
    prev: CrawlInfo,
    result: any
  ): CrawlInfo | CrawlInfo[] {
    const baseInfo = {
      ...prev,
      stage: this.stage,
      product: prev.product,
    };

    if (this.stage === InternalStage.Extract && Array.isArray(result)) {
      return result.map((item, index) => ({
        ...baseInfo,
        data: { ...prev.data, extract: item },
        index,
      }));
    }

    const newData: any = { ...prev.data };

    if (this.stage !== InternalStage.Init) {
      newData[this.stage] = result;
    }

    return {
      ...baseInfo,
      data: newData,
    };
  }

  private isErrorOutput(chunk: any): chunk is ErrorObject {
    return chunk && typeof chunk === "object" && "error" in chunk;
  }
}

export { PipelineTransform };
