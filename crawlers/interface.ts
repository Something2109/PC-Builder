import { Products } from "../utils/Enum";

/** Describe types for the crawl info object */

type RequestObject = {
  url: URL;
} & RequestInit;

type BaseRequestOptions = string | URL | RequestObject;

type RequestOptions<ResultType = unknown> =
  | BaseRequestOptions
  | {
      request: BaseRequestOptions;
      type?: InfoType;
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

type ProgressInfo = {
  created: Record<CrawlRecordKey, number>;
  processed: Record<CrawlRecordKey | "error", number>;
};

/** Describe the type for the output object. */

type BaseOutput = {
  progress: ProgressInfo;
};

type ErrorOutputObject<Result> = BaseOutput & {
  info?: CrawlInfo<Result>;
  error: Error;
};

type ResultOutputObject<Result> = BaseOutput & {
  info: CrawlInfo<Result>;
  result: Result;
};

type OutputObject<Result = unknown> =
  | BaseOutput
  | ErrorOutputObject<Result>
  | ResultOutputObject<Result>;

/** Describe required types for the crawl API inferface */

type ExtractFunctionType<Raw, Result, Fetched> =
  | ExtractFunction<
      CrawlInfo<Result>,
      DefaultExtractResult<Raw, Result>,
      Fetched
    >
  | {
      page: ExtractFunction<
        CrawlInfo<Result, "page">,
        ExtractPageResult<Result>,
        Fetched
      >;

      product: ExtractFunction<
        CrawlInfo<Result, "product">,
        ExtractProductResult<Raw>,
        Fetched
      >;
    };

type ExtractFunction<Link extends CrawlInfo<unknown>, Result, Fetched> = (
  info: Link,
  response: Fetched
) => Promise<Result>;

type DefaultExtractResult<Raw, Result> = {
  list: ExtractProductResult<Raw>;
} & ExtractPageResult<Result>;

type ExtractPageResult<Result> = {
  links: RequestOptions<Result>[];
  pages?: number;
};

type ExtractProductResult<Raw> = Raw[];

/**
 * The API that all the website crawling object must implement to be
 * used in the crawler.
 */
interface APIWebsiteInfo<Raw, Final, Fetched = Response> {
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
   * @param page The page number to be created.
   * @returns The request options of the link to be crawled.
   */
  path(product: Products, page: number): RequestOptions<Final> | null;

  /**
   * The custom fetch function for getting the data page ready
   * to extract data in the {@link extract} functions.
   * If none specified, the crawler uses the default {@link fetch} function of Node
   * @params request The request object to fetch object from.
   * @returns The {@link Fetched} object specified.
   */
  fetch?(request: RequestObject): Promise<Fetched>;

  /**
   * Extract the data list from the response object.
   * Can be a function or an object contains 2 functions
   * with the key {@link InfoType}.
   * @returns Default function should return an object contains
   * the list array of {@link Raw},
   * the links array of {@link RequestObject} to be fetched,
   * the optional pages number for the automatic add page function.
   * The page function should return an object of the links array and pages number.
   * The product function should return the list array.
   */
  extract: ExtractFunctionType<Raw, Final, Fetched>;

  /**
   * Parse each item from the result of the extract function to the useful data.
   * @param raw The raw data object to parse from.
   * @param info The crawl info linked to the raw info.
   * @returns The {@link Final} object parsed from the {@link raw} parameter.
   */
  parse(raw: Raw, info: CrawlInfo<Final>): Promise<Final>;
}

/** Provide the types used in the crawler */

type CrawlRecordKey = InfoType | "parse";

/**
 * The crawl handler interface.
 * Contains the basic crawl handler functions to crawl data.
 */
interface CrawlHandlerInterface<Raw, Final, Fetched = Response> {
  readonly created: Record<CrawlRecordKey, number>;
  readonly processed: Record<CrawlRecordKey | "error", number>;

  /**
   * Get the list of the first crawl infos
   * to start the crawl process.
   * Using the {@link APIWebsiteInfo.path} function.
   * @param products The product list to crawl.
   * @returns A list of crawl info.
   */
  start(products?: Products[]): CrawlInfo<Final>[];

  /**
   * Fetch the info given in the parameter.
   * If the fetch process exceeds a certain timeout, the function will throw error.
   * If the fetch response is not ok, the function will throw error.
   * @param info The given crawl info in the parameter.
   * @returns The response fetched from the info.
   */
  fetch(info: CrawlInfo<Final>): Promise<Fetched>;

  /**
   * Run the extract function in the website info
   * based on the provided info and link.
   * Handle the response received from the
   * using the functions declared in {@link APIWebsiteInfo.extract}.
   * @param info The crawl link used to fetch the response.
   * @param response The response received from the link.
   * @returns The extract result object containing the {@link Raw} data list extracted
   * and the newly created {@link CrawlInfo} list for further extraction.
   */
  extract(
    info: CrawlInfo<Final>,
    response: Fetched
  ): Promise<{ raw: Raw[]; info: CrawlInfo<Final>[] }>;

  /**
   * Run the {@link APIWebsiteInfo.parse} function in the website info
   * based on the provided info and link.
   * Parse the raw object to create the result object in the info object.
   * @param info The current info object.
   * @param raw The raw object extracted.
   * @returns The {@link ResultOutputObject} of the website info's parse funtion.
   */
  parse(info: CrawlInfo<Final>, raw: Raw): Promise<ResultOutputObject<Final>>;

  /**
   * The error handle function.
   * Should be called when encounter error.
   * @param info The crawl info being processed that encounters the error.
   * @param error The error caused the interuption.
   * @returns The {@link ErrorOutputObject} of the function.
   */
  error(
    info: CrawlInfo<Final>,
    error: Error
  ): Promise<ErrorOutputObject<Final>>;

  /**
   * Check if the crawler has finished crawling by
   * comparing the created and the processed counter
   * if they are equal or not.
   * @returns The boolean specifying the completion.
   */
  finish(): boolean;
}

/**
 * Specify if the parameter object is a crawler object.
 * @param object The object to specify.
 * @returns True if object is a crawler.
 */
function isCrawlInfo(object?: any): object is APIWebsiteInfo<unknown, unknown> {
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

export type {
  APIWebsiteInfo,
  CrawlInfo,
  ProgressInfo,
  RequestObject,
  RequestOptions,
  OutputObject,
  CrawlHandlerInterface,
  BaseOutput,
  ErrorOutputObject,
  ResultOutputObject,
};

export { isCrawlInfo };
