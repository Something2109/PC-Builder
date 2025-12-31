import { setTimeout } from "node:timers/promises";
import {
  APIWebsiteInfo,
  CrawlHandlerInterface,
  CrawlInfo,
  isCrawlInfo,
  RequestOptions,
} from "../interface";
import { Products } from "../../utils/Enum";

type CrawlHandlerOptions = {
  delay?: number;
  timeout?: number;
  retries?: number;
  log?: boolean | ((msg: string) => void);
};

/** Constants */

const DEFAULT_DELAY_TIME = 0;
const DEFAULT_TIMEOUT_TIME = 10000;
const DEFAULT_RETRIES = 3;
const DEFAULT_LOG_OPTION = (msg: string) => console.log(msg);

/**
 * The crawl handler class -
 * an implementation of the {@link CrawlHandlerInterface}.
 * Contains the basic crawl handler functions to crawl data
 * using the {@link APIWebsiteInfo}.
 */
class CrawlHandler<Raw, Final, Fetched>
  implements CrawlHandlerInterface<Raw, Final, Fetched>
{
  private readonly info: APIWebsiteInfo<Raw, Final, Fetched>;
  private readonly delay: number;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly log: ((msg: string) => void) | null;
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
    info: APIWebsiteInfo<Raw, Final, Fetched>,
    options?: CrawlHandlerOptions
  ) {
    if (!isCrawlInfo(info)) {
      throw new Error("The provided info is not implemented the API");
    }

    this.info = info;
    this.delay = options?.delay ?? DEFAULT_DELAY_TIME;
    this.timeout = options?.timeout ?? DEFAULT_TIMEOUT_TIME;
    this.retries = options?.retries ?? DEFAULT_RETRIES;
    this.created = { page: 0, product: 0, parse: 0 };
    this.processed = { page: 0, product: 0, parse: 0, error: 0 };
    this.log = null;
    if (options?.log) {
      this.log =
        typeof options.log === "function" ? options.log : DEFAULT_LOG_OPTION;
    }
  }

  public start(products?: Products[]) {
    products ??= Object.values(Products);

    this.logMessage(
      `Start crawling info in ${
        this.info.domain
      } and product in ${products.join(", ")}`
    );

    const infos: CrawlInfo<Final>[] = [];
    products.forEach((product) => {
      const request = this.info.path(product, 1);
      if (request) {
        infos.push(this.createInfo({ product, page: 1 }, request, "page"));
      }
    });

    return infos;
  }

  public async fetch(info: CrawlInfo<Final>): Promise<Fetched> {
    this.logMessage(`Fetching: ${info.request.url.toString()}`);

    try {
      if (this.delay > 0) {
        await setTimeout(this.delay);
      }

      return await this.withRetry(async () => {
        // Use AbortSignal.timeout for fetch timeout
        const signal = AbortSignal.timeout(this.timeout);
        const requestInit = {
          ...info.request,
          signal,
        };

        const fetchProcess = this.info.fetch
          ? this.info.fetch({ ...info.request, ...requestInit })
          : (fetch(info.request.url, requestInit) as Promise<Fetched>);

        const response = await fetchProcess;

        if (response instanceof Response) {
          if (!response.ok) {
            // Throw immediately on 404
            if (response.status === 404) {
              throw new Error(`Fetch error: 404 Not Found`);
            }
            // Throw for internal server errors or rate limits to trigger retry
            if (response.status >= 500 || response.status === 429) {
              throw new Error(
                `Fetch error: ${response.status} ${response.statusText}`
              );
            }
            // For other 4xx errors, we might want to throw or return as is.
            // Behaving as original: throw error
            throw new Error(
              `Fetch error: ${response.status} ${response.statusText}`
            );
          }
        }

        return response;
      });
    } catch (error) {
      this.processed["error"]++;
      throw error;
    }
  }

  private async withRetry<T>(task: () => Promise<T>): Promise<T> {
    let lastError: any;
    for (let i = 0; i <= this.retries; i++) {
      try {
        return await task();
      } catch (error: any) {
        lastError = error;
        // Don't retry on 404 (already handled in task by throwing specific error?)
        // The task throws "Fetch error: 404 Not Found".
        // The requirements say: "Handle 5xx and 429 errors but throw immediately on 404s."
        if (error.message?.includes("404")) {
          throw error;
        }

        if (i < this.retries) {
          const backoff = Math.pow(2, i) * 1000; // Exponential backoff: 1s, 2s, 4s...
          this.logMessage(
            `Retry ${i + 1}/${this.retries} after ${backoff}ms error: ${
              error.message
            }`
          );
          await setTimeout(backoff);
        }
      }
    }
    throw lastError;
  }

  public async extract(info: CrawlInfo<Final>, response: Fetched) {
    this.logMessage(`Extracting: ${info.request.url.toString()}`);

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
    this.logMessage(`Parsing ${info.request.url.toString()}`);

    const result = {
      info,
      result: await this.info.parse(raw, info),
      progress: { created: this.created, processed: this.processed },
    };

    this.processed["parse"]++;

    return result;
  }

  public async error(info: CrawlInfo<Final>, error: Error) {
    this.logMessage(`Error ${info.request.url.toString()}: ${error.message}`);

    const result = {
      info,
      error: { name: error.name, message: error.message, stack: error.stack },
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
      this.createInfo(info, link, "product")
    );

    if (info.type == "page" && pages && (list.length > 0 || links.length > 0)) {
      let nextPage = info.page;
      while (nextPage < pages) {
        nextPage++;
        newInfo.push(
          this.createInfo(
            { product: info.product, page: nextPage },
            this.info.path(info.product, nextPage)!,
            "page"
          )
        );
      }
    }

    return newInfo;
  }

  /**
   * The generic crawl info create function.
   * Increase the counter each successful call.
   * @param base The base object contains the basic info that
   * the new crawl info object inherited. Can take {@link CrawlInfo} as parameter.
   * @param options The options to create the link and type of the info.
   * @param defaultType The default type of the crawl info if not specified.
   * Used to make the system preference info type creation.
   * @returns The new crawl info created.
   */
  private createInfo(
    { product, page }: { product: Products; page: number },
    options: RequestOptions<Final>,
    defaultType: CrawlInfo<Final>["type"]
  ) {
    let request: RequestOptions,
      result: Final | undefined,
      type: CrawlInfo<Final>["type"] | undefined;
    if (typeof options !== "string" && "request" in options) {
      ({ request, type, result } = options);
    } else {
      request = options;
    }

    if (typeof request === "string" || request instanceof URL) {
      request = {
        url: new URL(request),
      };
    }

    if (!type) type = defaultType;

    this.created[type]++;
    return { request, type, product, page, result };
  }

  /**
   * Log the message using the log function provided.
   * @param msg The message to log.
   */
  private logMessage(msg: string) {
    this.log && console.log(msg);
  }
}

export { CrawlHandler, type CrawlHandlerOptions };
