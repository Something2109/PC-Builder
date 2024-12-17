import { Products } from "../../utils/Enum";
import { pipeline, Readable, Transform, Writable } from "stream";
import { CrawlHandlerInterface, CrawlInfo, OutputObject } from "../interface";

type FetchResult<Result> = {
  info: CrawlInfo<Result>;
  response: Response;
};

type ExtractResult<Raw, Result> = {
  info: CrawlInfo<Result>;
  raw: Raw;
};

type ParseResult<Result> = Required<CrawlInfo<Result>>;

type TransformCallback<Content> = (err?: Error | null, value?: Content) => void;

/**
 * The main crawler class.
 * The crawl process comprises many streams, each for a main crawl funtions, piped together
 * to decrease the block time of each crawl info's process affect the next one's process.
 * Should be used when dealing with large data of crawl info.
 */
class Crawler<Raw, Final> {
  private readonly handler: CrawlHandlerInterface<Raw, Final>;
  private input: Readable;
  private output: Writable;
  private autoEnd: boolean;

  /**
   * The crawler constructor.
   * @param info The website api to be used by the crawler.
   * @param options The options for the crawler. Take output as a {@link Writable}
   * to customize the output of the crawler.
   * The output's write function's chunk parameter must implement the {@link OutputObject}
   * to work properly.
   * Take auto as a boolean to determine if it automatically close the crawler when finish crawling.
   */
  constructor(
    handler: CrawlHandlerInterface<Raw, Final>,
    options?: { output?: Writable; autoEnd?: boolean }
  ) {
    this.handler = handler;

    this.input = new Readable({ objectMode: true, read() {} });
    this.output = options?.output ?? this.createDefaultOutput();
    this.autoEnd = options?.autoEnd ?? false;
  }

  /**
   * The crawl function.
   * Call this to start the crawling process.
   */
  async crawl(products?: Products[]) {
    const FetchStream = this.createFetchStream();

    const ExtractStream = this.createExtractStream();

    const ParseStream = this.createParseStream();

    pipeline(
      this.input,
      FetchStream,
      ExtractStream,
      ParseStream,
      this.output,
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );

    this.input.on("end", () => console.log("End"));

    this.handler.start(products).forEach((info) => {
      this.input.push(info);
    });
  }

  /**
   * Create a transform stream handling the fetch procedure.
   * The stream takes the input {@link CrawlInfo}
   * and return back the {@link FetchResult}.
   * @returns The fetch stream.
   */
  private createFetchStream() {
    const fetch = this.handler.fetch.bind(this.handler);
    const onError = this.onError.bind(this);
    const finish = this.finish.bind(this);

    return new Transform({
      objectMode: true,
      autoDestroy: false,
      transform(
        info: CrawlInfo<Final>,
        _,
        next: TransformCallback<FetchResult<Final>>
      ) {
        fetch(info)
          .then((response) => next(null, { info, response }))
          .catch((reason) => onError(reason, info).then(() => next()))
          .finally(finish);
      },
    });
  }

  /**
   * Create a stream handling the response extract procedure.
   * The stream takes the input {@link FetchResult}
   * and return back the {@link ExtractResult}
   * of {@link Raw} and {@link Final}.
   * @returns The extract stream created.
   */
  private createExtractStream() {
    const input = this.input;
    const extract = this.handler.extract.bind(this.handler);
    const onError = this.onError.bind(this);
    const finish = this.finish.bind(this);

    return new Transform({
      objectMode: true,
      autoDestroy: false,
      transform(
        { info, response }: FetchResult<Final>,
        _,
        callback: TransformCallback<ExtractResult<Raw, Final>>
      ) {
        extract(info, response)
          .then(({ raw: list, info: links }) => {
            links.forEach((link) => input.push(link));
            list.forEach((raw) => this.push({ info, raw }));
            callback();
          })
          .catch((reason) => onError(reason, info).then(() => callback()))
          .finally(finish);
      },
    });
  }

  /**
   * Create a stream handling the response extract procedure.
   * The stream takes the input {@link ExtractResult}
   * and return the {@link ParseResult}.
   * @returns The parse stream created.
   */
  private createParseStream() {
    const parse = this.handler.parse.bind(this.handler);
    const onError = this.onError.bind(this);
    const finish = this.finish.bind(this);

    return new Transform({
      objectMode: true,
      autoDestroy: false,
      transform(
        { info, raw }: ExtractResult<Raw, Final>,
        _,
        callback: TransformCallback<OutputObject<Final>>
      ) {
        parse(info, raw)
          .then((value) => callback(null, value))
          .catch((reason) => onError(reason, info).then(() => callback()))
          .finally(finish);
      },
    });
  }

  /**
   * Create a writable stream that write the {@link ParseResult}
   * to the {@link process.stdout} stream.
   * @returns The created output stream.
   */
  private createDefaultOutput() {
    return new Writable({
      objectMode: true,
      autoDestroy: false,
      write(chunk: OutputObject<Final>, _, callback) {
        "error" in chunk
          ? process.stdout.write(
              `${chunk.error.stack}\nIn: ${JSON.stringify(chunk)}\n`,
              callback
            )
          : process.stdout.write(`${JSON.stringify(chunk)}\n`, callback);
      },
    });
  }

  /**
   * Check if the crawler has finished crawling by
   * comparing the created and the processed counter
   * if they are equal or not.
   * If finished, close the {@link output}.
   */
  private finish() {
    if (this.handler.finish() && this.autoEnd) {
      this.input.push(null);
    }
  }

  private async onError(error: Error, info: CrawlInfo<Final>) {
    const message = await this.handler.error(info, error);

    this.output.write(message);
  }
}

export { Crawler };
