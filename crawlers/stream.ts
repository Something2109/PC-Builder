import { Transform, TransformOptions, TransformCallback } from "stream";
import { CrawlHandler, APIWebsiteInfo } from "./interface";

/**
 * The crawl stream extending the Node's {@link Transform} class.
 * The stream handles the info in a blocking way as
 * the node stream needs to finish the current transformation
 * to receive and process new data
 * (see: {@link https://nodejs.org/api/stream.html#implementing-a-transform-stream}
 * for more info).
 * Should be used when dealing with seperate crawl info.
 */
class CrawlStream<Raw, Final> extends Transform {
  private readonly handler: CrawlHandler<Raw, Final>;

  constructor(
    handler: CrawlHandler<Raw, Final>,
    options?: Omit<TransformOptions, "objectMode">
  ) {
    super({ objectMode: true, ...options });

    this.handler = handler;
  }

  _transform(chunk: any, _: BufferEncoding, callback: TransformCallback): void {
    this.handler
      .fetch(chunk)
      .then((response) => this.handler.extract(chunk, response))
      .then(({ raw, info }) => {
        info.forEach((val) => this.push(val));
        return Promise.all(
          raw.map((value) => this.handler.parse(chunk, value))
        );
      })
      .then((finalType) => finalType.forEach((value) => this.push(value)))
      .then(() => callback())
      .catch((error: Error) => this.push({ ...chunk, error: error.stack }));
  }
}

export { CrawlStream };
