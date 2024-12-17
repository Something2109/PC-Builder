import { setTimeout } from "timers/promises";
import {
  APIWebsiteInfo,
  CrawlHandlerInterface,
  CrawlInfo,
  isCrawlInfo,
  RequestObject,
  RequestOptions,
} from "../interface";
import { Products } from "../../utils/Enum";

/** Constants */

const DEFAULT_DELAY_TIME = 0;
const DEFAULT_TIMEOUT_TIME = 10000;

const DELAY_FLAG = "delay" as const;
const TIMEOUT_FLAG = "fetch_fail" as const;

/**
 * The crawl handler class -
 * an implementation of the {@link CrawlHandlerInterface}.
 * Contains the basic crawl handler functions to crawl data
 * using the {@link APIWebsiteInfo}.
 */
class CrawlHandler<Raw, Final> implements CrawlHandlerInterface<Raw, Final> {
  private readonly info: APIWebsiteInfo<Raw, Final>;
  private delay: number;
  private timeout: number;
  readonly created;
  readonly processed;

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
    if (!isCrawlInfo(info)) {
      throw new Error("The provided info is not implemented the API");
    }

    this.info = info;
    this.delay = options?.delay ?? DEFAULT_DELAY_TIME;
    this.timeout = options?.timeout ?? DEFAULT_TIMEOUT_TIME;
    this.created = { page: 0, product: 0, parse: 0 };
    this.processed = { page: 0, product: 0, parse: 0, error: 0 };
  }

  public start(products?: Products[]) {
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

  public async fetch(info: CrawlInfo<Final>) {
    console.log(`Fetching: ${info.request.url.toString()}`);

    const fetchProcess = fetch(info.request.url, info.request);
    const delayTimeout = setTimeout(this.delay, DELAY_FLAG);
    const fetchTimeout = setTimeout(this.timeout, TIMEOUT_FLAG);

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

  public async extract(info: CrawlInfo<Final>, response: Response) {
    console.log(`Extracting: ${info.request.url.toString()}`);

    let links: RequestOptions<Final>[] = [],
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

    this.created.parse += list.length;
    this.processed[info.type]++;

    return { raw: list, info: newInfo };
  }

  public async parse(info: CrawlInfo<Final>, raw: Raw) {
    console.log(`Parsing ${info.request.url.toString()}`);

    const result = {
      ...info,
      result: await this.info.parse(raw, info),
      progress: { created: this.created, processed: this.processed },
    };

    this.processed["parse"]++;

    return result;
  }

  public async error(info: CrawlInfo<Final>, error: Error) {
    console.log(`Parsing ${info.request.url.toString()}`);

    const result = {
      ...info,
      error,
      progress: { created: this.created, processed: this.processed },
    };

    this.processed["error"]++;

    return result;
  }

  public finish() {
    const totalProcessed = Object.values(this.processed).reduce(
      (prev, cur) => prev + cur,
      0
    );

    const totalCreated = Object.values(this.created).reduce(
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
    links: RequestOptions<Final>[],
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
    if (typeof options !== "string" && "request" in options) {
      options = options.request;
    }
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

    this.created.page++;
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
    options: RequestOptions<Final>
  ): CrawlInfo<Final, "product"> {
    let request: RequestOptions, result: Final | undefined;
    if (typeof options !== "string" && "request" in options) {
      ({ request, result } = options);
    } else {
      request = options;
    }
    request = this.createRequest(request);

    this.created.product++;
    return { ...info, type: "product", request, result };
  }
}

export { CrawlHandler };
