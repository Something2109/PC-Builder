import { Products } from "../utils/Enum";
import { setTimeout } from "timers/promises";

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

type ErrorOutputObject<Result> = CrawlInfo<Result> & { error: Error };

type ResultOutputObject<Result> = Required<CrawlInfo<Result>>;

type OutputObject<Result = unknown> =
  | ErrorOutputObject<Result>
  | ResultOutputObject<Result>;

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

/** Constants */

const DEFAULT_DELAY_TIME = 0;
const DEFAULT_TIMEOUT_TIME = 10000;

const DELAY_FLAG = "delay";
const TIMEOUT_FLAG = "fetch_fail";

/**
 * The crawl handler class.
 * Contains the basic crawl handler functions to crawl data
 * using the {@link APIWebsiteInfo}.
 */
class CrawlHandler<Raw, Final> {
  private readonly info: APIWebsiteInfo<Raw, Final>;
  private delay: number;
  private timeout: number;
  readonly counter: Record<CrawlRecordKey, number>;
  readonly processed: Record<CrawlRecordKey | "error", number>;

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
    options?: { delay?: number; timeout?: number }
  ) {
    if (!CrawlHandler.isCrawlInfo(info)) {
      throw new Error("The provided info is not implemented the API");
    }

    this.info = info;
    this.delay = options?.delay ?? DEFAULT_DELAY_TIME;
    this.timeout = options?.timeout ?? DEFAULT_TIMEOUT_TIME;
    this.counter = { page: 0, product: 0, parse: 0 };
    this.processed = { page: 0, product: 0, parse: 0, error: 0 };
  }

  /**
   * Get the list of the first crawl infos
   * to start the crawl process.
   * @param products The product list to crawl.
   * @returns A list of crawl info.
   */
  public start(products?: Products[]): CrawlInfo<Final>[] {
    if (!products) {
      products = Object.values(Products);
    }

    const infos: CrawlInfo<Final>[] = [];
    products.forEach((product) => {
      const request = this.info.path(product, 1);
      if (request) {
        infos.push(this.createPageInfo({ product, page: 1 }, request));
      }
    });

    return infos;
  }

  /**
   * Fetch the info given in the parameter.
   * If the fetch process exceeds {@link timeout}, the function will throw error.
   * If the fetch response is not ok, the function will throw error.
   * @param info The given crawl info in the parameter.
   * @returns The response fetched from the info.
   */
  public async fetch(info: CrawlInfo<Final>) {
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
   * Run the extract function in the website info
   * based on the provided info and link.
   * Auto push the extra link crawled from the website
   * to {@link input}.
   * @param info The crawl link used to fetch the response.
   * @param response The response received from the link.
   * @returns The extract result object.
   */
  public async extract(
    info: CrawlInfo<Final>,
    response: Response
  ): Promise<{ raw: Raw[]; info: CrawlInfo<Final>[] }> {
    console.log(`Extracting: ${info.request.url.toString()}`);

    let links: ProductRequestOptions<Final>[] = [],
      list: Raw[] = [],
      pages;

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

    const newInfo = this.extractLinkHandler(info, list, links, pages);

    this.counter.parse += list.length;
    this.processed[info.type]++;

    return { raw: list, info: newInfo };
  }

  /**
   * Run the parse function in the website info
   * based on the provided info and link.
   * Parse the raw object to create the result object in the info object.
   * @param info The current info object.
   * @param raw The raw object extracted
   * @returns The result of the website info's parse funtion.
   */
  public async parse(
    info: CrawlInfo<Final>,
    raw: Raw
  ): Promise<Required<CrawlInfo<Final>>> {
    console.log(`Parsing ${info.request.url.toString()}`);

    info.result = await this.info.parse(raw, info);
    this.processed["parse"]++;

    return info as Required<CrawlInfo<Final>>;
  }

  /**
   * Check if the crawler has finished crawling by
   * comparing the created and the processed counter
   * if they are equal or not.
   * @returns The boolean specifying the completion.
   */
  public finish() {
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
   * Get the next requests of the request data and
   * push it to the request queue.
   * @param info The current request object.
   * @param pages The number of next requests from the current one.
   */
  private extractLinkHandler(
    info: CrawlInfo<Final>,
    list: Raw[],
    links: ProductRequestOptions<Final>[],
    pages?: number
  ) {
    const newInfo: CrawlInfo<Final>[] = links.map((link) =>
      this.createProductInfo(info, link)
    );

    if (info.type == "page" && pages && (list.length > 0 || links.length > 0)) {
      let nextPage = info.page;
      while (nextPage < pages) {
        nextPage++;
        newInfo.push(
          this.createPageInfo(
            { product: info.product, page: nextPage },
            this.info.path(info.product, nextPage)!
          )
        );
      }
    }

    return newInfo;
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
    info: { product: Products; page: number },
    options: RequestOptions
  ): CrawlInfo<Final, "page"> {
    options = this.createRequest(options);

    this.counter.page++;
    return { type: "page", ...info, request: options };
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
}

export { CrawlHandler, type APIWebsiteInfo, type CrawlInfo, type OutputObject };
