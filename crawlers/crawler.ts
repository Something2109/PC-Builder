import { Products } from "../utils/Enum";
import { setTimeout } from "timers/promises";
import { pipeline, Readable, Transform, Writable } from "stream";

/** Describe types for the crawl info object */

type RequestObject = {
  url: URL;
} & RequestInit;

type RequestOptions = string | URL | RequestObject;

type ProductRequestOptions<ResultType> =
  | RequestOptions
  | {
      request: RequestOptions;
      result?: ResultType;
    };

type InfoType = "page" | "product";

type CrawlInfo<Result, Type = InfoType> = {
  request: RequestObject;
  type: Type;
  product: Products;
  page: number;
  result?: Result;
};

/** Describe required types for the crawl API inferface */

type ExtractFunctionType<Raw, Result> =
  | ExtractFunction<CrawlInfo<Result>, DefaultExtractResult<Raw, Result>>
  | {
      page: ExtractFunction<
        CrawlInfo<Result, "page">,
        ExtractPageResult<Result>
      >;

      product: ExtractFunction<
        CrawlInfo<Result, "product">,
        ExtractProductResult<Raw>
      >;
    };

type ExtractFunction<Link extends CrawlInfo<unknown>, Result> = (
  info: Link,
  response: Response
) => Promise<Result>;

type DefaultExtractResult<Raw, Result> = {
  list: ExtractProductResult<Raw>;
} & ExtractPageResult<Result>;

type ExtractPageResult<Result> = {
  links: ProductRequestOptions<Result>[];
  pages?: number;
};

type ExtractProductResult<Raw> = Raw[];

/**
 * The API that all the website crawling object must implement to be
 * used in the crawler.
 */
interface APIWebsiteInfo<Raw, Final> {
  /**
   * The website domain.
   */
  domain: string;

  /**
   * The save path of the crawled data.
   */
  save: string;

  /**
   * Create the URL to crawl data from the product enum.
   * @param product The product enum to crawl from.
   */
  path(product: Products, page: number): RequestOptions | null;

  /**
   * Extract the data list from the response object.
   */
  extract: ExtractFunctionType<Raw, Final>;

  /**
   * Parse each item from the result of the extract function to the useful data.
   * @param raw The raw data object to parse from.
   * @param info The crawl info linked to the raw info.
   */
  parse(raw: Raw, info: CrawlInfo<Final>): Promise<Final>;
}

/** Provide the types used in the crawler */

type CrawlRecordKey = InfoType | "parse";

type FetchResult<Result> = {
  info: CrawlInfo<Result>;
  response: Response;
};

type ExtractResult<Raw, Result> = {
  info: CrawlInfo<Result>;
  raw: Raw;
};

type ParseResult<Result> = Required<CrawlInfo<Result>>;

type ErrorOutputObject<Result> = CrawlInfo<InfoType, Result> & { error: Error };

type ResultOutputObject<Result> = Required<CrawlInfo<Result>>;

type OutputObject<Result = unknown> =
  | ErrorOutputObject<Result>
  | ResultOutputObject<Result>;

type TransformCallback<Content> = (err?: Error | null, value?: Content) => void;

/** Constants */

const DEFAULT_DELAY_TIME = 0;
const DEFAULT_TIMEOUT_TIME = 10000;

const DELAY_FLAG = "delay";
const TIMEOUT_FLAG = "fetch_fail";

class Crawler<Raw, Final> {
  private readonly info: APIWebsiteInfo<Raw, Final>;
  private input: Readable;
  private output: Writable;
  private delay: number;
  private timeout: number;
  private counter: Record<CrawlRecordKey, number>;
  private processed: Record<CrawlRecordKey | "error", number>;

  /**
   * Specify if the parameter object is a crawler object.
   * @param object The object to specify.
   * @returns True if object is a crawler.
   */
  static isCrawlInfo(object?: any): object is APIWebsiteInfo<unknown, unknown> {
    return (
      object &&
      "domain" in object &&
      "path" in object &&
      typeof object["path"] == "function" &&
      "extract" in object &&
      (typeof object.extract == "function" ||
        (typeof object.extract == "object" &&
          object.extract.page &&
          object.extract.product)) &&
      "parse" in object &&
      typeof object.parse == "function"
    );
  }

  /**
   * The crawler constructor.
   * @param info The website api to be used by the crawler.
   * @param options The options for the crawler. Take output as a {@link Writable}
   * to customize the output of the crawler.
   * The output's write function's chunk parameter must implement the {@link OutputObject}
   * to work properly.
   */
  constructor(
    info: APIWebsiteInfo<Raw, Final>,
    options?: { output?: Writable; delay?: number; timeout?: number }
  ) {
    if (!Crawler.isCrawlInfo(info)) {
      throw new Error("The provided info is not implemented the API");
    }

    this.info = info;
    this.input = new Readable({ objectMode: true, read() {} });
    this.output = options?.output ?? this.createDefaultOutput();
    this.delay = options?.delay ?? DEFAULT_DELAY_TIME;
    this.timeout = options?.timeout ?? DEFAULT_TIMEOUT_TIME;
    this.counter = { page: 0, product: 0, parse: 0 };

    this.processed = { page: 0, product: 0, parse: 0, error: 0 };
  }

  /**
   * The crawl function.
   * Call this to start the crawling process.
   */
  async crawl(products?: Products[]) {
    const FetchStream = this.createFetchStream();

    const ExtractStream = this.createExtractStream();

    const ParseStream = this.createParseStream();

    const OutputStream = this.createOutputStream();

    const onError = this.onError.bind(this);

    pipeline(
      this.input,
      FetchStream,
      ExtractStream,
      ParseStream,
      OutputStream,
      (error) => onError(error)
    );

    this.input.on("end", () => console.log("End"));

    this.start(products);
  }

  /**
   * Create a transform stream handling the fetch procedure.
   * The stream takes the input {@link CrawlInfo}
   * and return back the {@link FetchResult}.
   * @returns The fetch stream.
   */
  private createFetchStream() {
    const fetch = this.fetch.bind(this);
    const onError = this.onError.bind(this);

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
          .catch((reason) => {
            onError(reason, info);
            next();
          });
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
    const extract = this.extract.bind(this);
    const result = this.createExtractResult.bind(this);

    return new Transform({
      objectMode: true,
      autoDestroy: false,
      transform(
        { info, response }: FetchResult<Final>,
        _,
        callback: TransformCallback<ExtractResult<Raw, Final>>
      ) {
        extract(info, response)
          .then((list) => {
            list.forEach((raw) => this.push(result(info, raw)));
            callback();
          })
          .catch((reason) => callback(reason));
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
    const parse = this.parse.bind(this);

    return new Transform({
      objectMode: true,
      autoDestroy: false,
      transform(
        chunk: ExtractResult<Raw, Final>,
        _,
        callback: TransformCallback<ParseResult<Final>>
      ) {
        parse(chunk)
          .then((value) => callback(null, value))
          .catch((reason) => callback(reason));
      },
    });
  }

  /**
   * Create the writable stream that check
   * when the crawling process is finished or not
   * to close the output variable stream.
   * @returns The created stream.
   */
  private createOutputStream() {
    let writeCount = 0;
    const finish = (
      chunk: OutputObject<Final>,
      callback: (err?: Error | null) => void
    ) => {
      writeCount++;

      this.isFinished() && writeCount === this.counter.parse
        ? this.output.end(chunk, callback)
        : this.output.write(chunk, callback);
    };

    return new Writable({
      objectMode: true,
      autoDestroy: false,
      write(chunk, _, callback) {
        finish(chunk, callback);
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
              `${chunk.error.stack}\nIn: ${JSON.stringify(chunk)}\n`
            )
          : process.stdout.write(`${JSON.stringify(chunk)}\n`);
        callback();
      },
    });
  }

  /**
   * Start the crawling process of websites
   * by adding the new fetch request to the request queue
   * from the website list.
   * @param products The product list to crawl.
   */
  private start(products?: Products[]) {
    if (!products) {
      products = Object.values(Products);
    }

    products.map((product) => {
      try {
        const request = this.info.path(product, 1);
        if (request) {
          this.input.push(this.createPageInfo(product, request, 1));
        }
      } catch (err) {
        this.onError(err as Error);
      }
    });
  }

  /**
   * Fetch the info given in the parameter.
   * If the fetch process exceeds {@link timeout}, the function will throw error.
   * If the fetch response is not ok, the function will throw error.
   * @param info The given crawl info in the parameter.
   * @returns The response fetched from the info.
   */
  private async fetch(info: CrawlInfo<Final>) {
    console.log(`Fetching: ${info.request.url.toString()}`);

    const fetchProcess = fetch(info.request.url, info.request);
    const delayTimeout = setTimeout<typeof DELAY_FLAG>(this.delay, DELAY_FLAG);
    const fetchTimeout = setTimeout<typeof TIMEOUT_FLAG>(
      this.timeout,
      TIMEOUT_FLAG
    );

    /** Race between the 3 promise. */
    let response = await Promise.race([
      fetchProcess,
      delayTimeout,
      fetchTimeout,
    ]);

    /** If the delay promise finishes 1st, await for completion of the other 2. */
    if (response === DELAY_FLAG) {
      response = await Promise.race([fetchProcess, fetchTimeout]);
    }

    /** If the timeout promise finishes 1st, throw an error. */
    if (response === TIMEOUT_FLAG) {
      throw new Error(
        `Fetch error: fetching process exceeds the timeout time.`
      );
    }

    /** await delay promise if not finished. */
    await delayTimeout;

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  /**
   * Run the extract function in the info
   * based on the provided info and link.
   * Used in the {@link createExtractStream} function
   * to create the Extract steam.
   * @param info The crawl link used to fetch the response.
   * @param response The response received from the link.
   * @returns The extract result object.
   */
  private async extract(
    info: CrawlInfo<Final>,
    response: Response
  ): Promise<Raw[]> {
    console.log(`Extracting: ${info.request.url.toString()}`);

    let links: ProductRequestOptions<Final>[] = [],
      list: Raw[] = [],
      pages;

    try {
      if (typeof this.info.extract === "function") {
        ({ links, list, pages } = await this.info.extract(info, response));
      } else if (info.type === "page") {
        ({ links, pages } = await this.info.extract.page(
          info as CrawlInfo<Final, "page">,
          response
        ));
      } else {
        list = await this.info.extract.product(
          info as CrawlInfo<Final, "product">,
          response
        );
      }

      if (
        info.type == "page" &&
        pages &&
        (list.length > 0 || links.length > 0)
      ) {
        this.next(info, pages);
      }

      this.processed[info.type]++;
    } catch (err) {
      this.onError(err as Error, info);
    }

    links.forEach((element) => {
      this.input.push(this.createProductInfo(info, element));
    });

    return list;
  }

  /**
   * Parse the raw object to create the result object in the info object
   * Used in the {@link createParseStream} function
   * to create the Parse steam.
   * @param info The current info object.
   * @param raw The raw object extracted
   * @returns
   */
  private async parse({
    info,
    raw,
  }: ExtractResult<Raw, Final>): Promise<ParseResult<Final>> {
    console.log(`Parsing ${info.request.url.toString()}`);

    try {
      info.result = await this.info.parse(raw, info);
      this.processed["parse"]++;
    } catch (err) {
      this.onError(err as Error, info);
    }

    return info as ParseResult<Final>;
  }

  /**
   * Get the next requests of the request data and
   * push it to the request queue.
   * @param info The current request object.
   * @param pages The number of next requests from the current one.
   */
  private next(info: CrawlInfo<Final>, pages: number) {
    let nextPage = info.page;
    while (nextPage < pages) {
      nextPage++;
      this.input.push(
        this.createPageInfo(
          info.product,
          this.info.path(info.product, nextPage)!,
          nextPage
        )
      );
    }
  }

  /**
   * Check if the crawler has finished crawling by
   * comparing the created and the processed counter
   * if they are equal or not.
   * @returns A boolean representing the result.
   */
  private isFinished() {
    const totalProcessed = Object.values(this.processed).reduce(
      (prev, cur) => prev + cur,
      0
    );

    const totalCreated = Object.values(this.counter).reduce(
      (prev, cur) => prev + cur,
      0
    );

    return totalProcessed === totalCreated;
  }

  /**
   * Create the request object for the crawl info.
   * @param options The request options.
   * @returns The request object created.
   */
  private createRequest(options: RequestOptions): RequestObject {
    if (typeof options === "string" || options instanceof URL) {
      options = {
        url: new URL(options),
      };
    }

    return options;
  }

  /**
   * Create a page link object from the parameters.
   * Increase the page counter each successful call.
   * @param product The product of the page link.
   * @param options The request object of the link.
   * @param page The page number the request represented.
   * @returns The page link object created.
   */
  private createPageInfo(
    product: Products,
    options: RequestOptions,
    page: number
  ): CrawlInfo<Final, "page"> {
    options = this.createRequest(options);

    this.counter.page++;
    return { type: "page", product, request: options, page };
  }

  /**
   * Create a product link object from the parameters.
   * Increase the product counter each successful call.
   * @param info The product of the product link.
   * @param options The options to create product link.
   * @returns The product link object created.
   */
  private createProductInfo(
    info: CrawlInfo<Final>,
    options: ProductRequestOptions<Final>
  ): CrawlInfo<Final, "product"> {
    let request: RequestOptions, result: Final | undefined;
    if (typeof options !== "string" && "request" in options) {
      ({ request, result } = options);
    } else {
      request = options;
    }
    request = this.createRequest(request);

    this.counter.product++;
    return { ...info, type: "product", request, result };
  }

  /**
   * A function purely used to increase the parse counter.
   * Return the {@link ExtractResult} type as result.
   * @param info The info creating the raw result.
   * @param raw The raw result of the info.
   * @returns The extract result.
   */
  private createExtractResult(
    info: CrawlInfo<Final>,
    raw: Raw
  ): ExtractResult<Raw, Final> {
    this.counter.parse++;
    return { info, raw };
  }

  private onError(error: Error | null, info?: CrawlInfo<Final>) {
    this.processed.error++;
    this.output.write({ ...info, error });
  }
}

export { Crawler, type APIWebsiteInfo, type OutputObject };
