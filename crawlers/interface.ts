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
      stage?: InternalStage;
      result?: ResultType;
    };

export enum InternalStage {
  Init = "init",
  Fetch = "fetch",
  Extract = "extract",
  Parse = "parse",
}

export type CrawlData<
  S extends InternalStage,
  Raw,
  Final,
  Fetched
> = S extends InternalStage.Init
  ? { product?: Products }
  : S extends InternalStage.Fetch
  ? { product?: Products; fetch: Fetched }
  : S extends InternalStage.Extract
  ? { product?: Products; fetch: Fetched; extract: Raw }
  : S extends InternalStage.Parse
  ? { product?: Products; fetch: Fetched; extract: Raw; parse: Final }
  : never;

interface CrawlInfo<
  S extends InternalStage = InternalStage,
  Raw = any,
  Final = Raw,
  Fetched = any
> {
  stage: S;
  data: CrawlData<S, Raw, Final, Fetched>;
  request: RequestObject;
  index: number;
  product: Products;
}

type ProgressInfo = {
  created: Record<CrawlRecordKey, number>;
  processed: Record<CrawlRecordKey | "error", number>;
};

/** Describe the type for the output object. */

type BaseOutput = {
  progress: ProgressInfo;
};

type ErrorOutputObject<Result> = BaseOutput & {
  info?: CrawlInfo;
  error: Error;
};

type ResultOutputObject<Result> = BaseOutput & {
  info: CrawlInfo;
  result: Result;
};

type OutputObject<Result = unknown> =
  | BaseOutput
  | ErrorOutputObject<Result>
  | ResultOutputObject<Result>;

/** Describe required types for the crawl API inferface */

export type FetchFunction<Fetched> = (
  request: RequestObject
) => Promise<Fetched>;

export type ExtractFunction<Raw, Fetched> = (
  info: CrawlInfo,
  source: Fetched
) => Promise<Raw[]>;

export type ParseFunction<Raw, Result> = (
  raw: Raw,
  info: CrawlInfo
) => Promise<Result>;

/**
 * The API that all the website crawling object must implement to be
 * used in the crawler.
 */
interface APIWebsiteInfo<Raw, Final = Raw, Fetched = Response> {
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
  path?(product: Products, page: number): RequestOptions<Final> | null;

  /**
   * The custom fetch function for getting the data page ready
   * to extract data in the {@link extract} functions.
   * If none specified, the crawler uses the default {@link fetch} function of Node
   * @params request The request object to fetch object from.
   * @returns The {@link Fetched} object specified.
   */
  fetch?: FetchFunction<Fetched>;

  /**
   * Extract the data list from the response object.
   * @returns The list array of {@link Raw}
   */
  extract: ExtractFunction<Raw, Fetched>;

  /**
   * Parse each item from the result of the extract function to the useful data.
   * @param raw The raw data object to parse from.
   * @param info The crawl info linked to the raw info.
   * @returns The {@link Final} object parsed from the {@link raw} parameter.
   */
  parse?: ParseFunction<Raw, Final>;
}

/** Provide the types used in the crawler */

type CrawlRecordKey = InternalStage;

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
    typeof object.extract == "function" &&
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
  BaseOutput,
  ErrorOutputObject,
  ResultOutputObject,
};

export { isCrawlInfo };
