import { Products } from "./utils/Enum";

/** Describe types for the crawl info object */

type RequestObject = {
  url: URL;
} & RequestInit;

type BaseRequestOptions = string | URL | RequestObject;

type RequestOptions = {
  request: BaseRequestOptions;
  product: Products;
};

enum InternalStage {
  Init = "init",
  Fetch = "fetch",
  Extract = "extract",
  Parse = "parse",
}

type CrawlStageResult = {
  [InternalStage.Init]: RequestObject;
  [InternalStage.Fetch]: string;
  [InternalStage.Extract]: string;
  [InternalStage.Parse]: string;
};

/**
 * Mapped type defining the data structure available at each stage.
 * Keys are the stages, values are the cumulative data (product + previous stages' results).
 */
type CrawlStageDataMap = {
  [InternalStage.Init]: InternalStage.Init;
  [InternalStage.Fetch]: InternalStage.Init | InternalStage.Fetch;
  [InternalStage.Extract]:
    | InternalStage.Init
    | InternalStage.Fetch
    | InternalStage.Extract;
  [InternalStage.Parse]:
    | InternalStage.Init
    | InternalStage.Fetch
    | InternalStage.Extract
    | InternalStage.Parse;
};

/**
 * The data attached to the CrawlInfo, strictly typed based on the current stage `S`.
 * It selects the appropriate shape from `CrawlDataMap`.
 */
export type CrawlData<S extends InternalStage> = CrawlStageResult[S];

interface CrawlInfo<S extends InternalStage = InternalStage> {
  stage: S;
  data: Pick<CrawlStageResult, CrawlStageDataMap[S]>;
  request: BaseRequestOptions;
  index: number;
  product: Products;
}

/** Describe the type for the output object. */

/**
 * Options to configure the stream behavior.
 */
export type StreamOptions = {
  /** Check `concurrency` in {@link PipelineTransform} */
  concurrency?: number;
  /** Check `highWaterMark` in {@link PipelineTransform} */
  highWaterMark?: number;
};

type ErrorObject = {
  info: CrawlInfo;
  error: Error;
};

/** Describe required types for the crawl API inferface */

export type FetchFunction<Fetched> = (
  request: RequestObject
) => Promise<Fetched>;

export type ExtractFunction<Raw, Fetched> = (
  source: Fetched,
  info: CrawlInfo<InternalStage.Fetch>
) => Promise<Raw[] | { raw: Raw[]; next: RequestOptions[] }>;

export type ParseFunction<Raw, Result> = (
  raw: Raw,
  info: CrawlInfo<InternalStage.Extract>
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
  path?(product: Products, page: number): RequestOptions | null;

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
  RequestObject,
  RequestOptions,
  ErrorObject,
};

export { InternalStage, isCrawlInfo };
