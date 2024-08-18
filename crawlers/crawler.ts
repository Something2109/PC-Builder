import path from "path";
import fs from "fs";
import { Products } from "@/models/interface";

type BaseLink = {
  url: URL;
  type: "page" | "product";
  product: Products;
} & RequestInit;

type PageLink = {
  type: "page";
  page: number;
} & BaseLink;

type ProductLink = {
  type: "product";
} & BaseLink;

type CrawlLink = PageLink | ProductLink;

type Request<link extends CrawlLink> = {
  link: link;
  info: APIWebsiteInfo<unknown, unknown>;
};

type Result = {
  info: APIWebsiteInfo<unknown, unknown>;
  product: Products;
  list: unknown[];
};

type ProductMapping = { [key in Products]?: any[] };

interface APIWebsiteInfo<RawType, ReturnType> {
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
  path(product: Products, page: number): PageLink | null;

  /**
   * Extract the data list from the response object.
   * @param response The response object to extract data.
   */
  extract(
    link: CrawlLink,
    response: Response
  ): Promise<{
    list: RawType[];
    links: CrawlLink[];
    pages: number | null;
  }>;

  /**
   * Parse each item from the result of the extract function to the useful data.
   * @param raw The raw data object to parse from.
   */
  parse(raw: RawType, product?: Products): ReturnType;
}

const WebsitePerFetch = 3;
const FetchEachLoop = 10;
const DelayTime = 5000;

class Crawler {
  private static dataPath = path.join(".", "data");
  private static websites: APIWebsiteInfo<unknown, unknown>[] = [];
  private static requests: Request<CrawlLink>[] = [];
  private static errors: { link: CrawlLink; error: unknown }[] = [];

  /**
   * Specify if the parameter object is a crawler object.
   * @param object The object to specify.
   * @returns True if object is a crawler.
   */
  static isCrawlInfo(object?: any): object is APIWebsiteInfo<any, any> {
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

  /**
   * Add a website to initiate crawl.
   * @param info The info to crawl.
   */
  static add(info: APIWebsiteInfo<unknown, unknown>): void {
    this.websites.push(info);
  }

  /**
   * The crawl function.
   * Call this to start the crawling process.
   */
  static async crawl() {
    while (this.websites.length > 0) {
      this.start();

      const result: Result[] = [];

      while (this.requests.length > 0) {
        const promises = this.requests
          .splice(0, FetchEachLoop)
          .map((link) => this.fetchRequest(link));

        result.push(
          ...(await Promise.all(promises)).filter((result) => result != null)
        );

        await new Promise((resolve) => setTimeout(resolve, DelayTime));
      }

      const data = this.map(result);
      this.save(data);
    }

    if (this.errors.length > 0) {
      const date = new Date();
      fs.writeFileSync(
        path.join(this.dataPath, `errors-${date.getTime()}.json`),
        JSON.stringify(this.errors)
      );
    }
    this.errors.length = 0;
  }

  /**
   * Start the crawling process of websites
   * by adding the new fetch request to the request queue
   * from the website list.
   */
  private static start() {
    this.websites.splice(0, WebsitePerFetch).forEach((info) => {
      Object.values(Products).map((product) => {
        const link = info.path(product, 1);
        if (link) {
          this.requests.push({ link, info });
        }
      });
    });
  }

  /**
   * The fetching process of a request.
   * @param param The request object of the process.
   * @returns The result of the process.
   */
  private static async fetchRequest({
    link,
    info,
  }: Request<CrawlLink>): Promise<Result | null> {
    const { url, method, body } = link;

    console.log(`fetching ${url}`);
    try {
      const response = await fetch(url, { method, body });
      if (!response.ok) {
        throw new Error(`Response code: ${response.status}`);
      }

      const { list, links, pages } = await info.extract(link, response);

      if (
        link.type == "page" &&
        pages &&
        (list.length > 0 || links.length > 0)
      ) {
        this.next({ link, info }, pages);
      }

      this.requests.push(
        ...links.map((value) => {
          return { link: value, info };
        })
      );

      return {
        info,
        product: link.product,
        list: list.map((raw) => info.parse(raw, link.product)),
      };
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Error crawling ${link.url.toString()}.`);
      console.error(error);
      this.errors.push({ link, error: error.message });
    }

    return null;
  }

  /**
   * Get the next requests of the request data and
   * push it to the request queue.
   * @param param0 The current request object.
   * @param pages The number of next requests from the current one.
   */
  private static next({ link, info }: Request<PageLink>, pages: number) {
    let nextPage = link.page;
    while (nextPage < pages) {
      nextPage++;
      this.requests.push({
        link: info.path(link.product, nextPage)!,
        info,
      });
    }
  }

  /**
   * Map the crawled data based on the origin website and the product type.
   * @param result The result of the requests.
   * @returns The mapped data object.
   */
  private static map(result: Result[]): Record<string, ProductMapping> {
    const data: Record<string, ProductMapping> = {};

    result.forEach(({ info, product, list }) => {
      const key = path.join(
        info.save,
        info.domain.replaceAll(/(https:\/\/|www.|\.com|\.vn|\.)+/g, "")
      );

      if (!data[key]) {
        data[key] = {};
      }

      if (!data[key][product]) {
        data[key][product] = [];
      }

      data[key][product].push(...list);
    }, {});

    return data;
  }

  /**
   * Save the mapped data object to the file system.
   * @param result The mapped data object.
   */
  private static save(result: Record<string, ProductMapping>) {
    if (!fs.existsSync(this.dataPath)) {
      fs.mkdirSync(this.dataPath);
    }

    Object.entries(result).forEach(([key, value]) => {
      const savePath = path.join(
        this.dataPath,
        key.replaceAll(/(https:\/\/|www.|\.com|\.vn|\.)+/g, "")
      );

      if (!fs.existsSync(savePath)) {
        fs.mkdirSync(savePath);
      }

      Object.entries(value).forEach(([product, list]) => {
        console.log(
          `Fetched ${list.length} products of ${product} from ${key}`
        );
        fs.writeFileSync(
          path.join(savePath, `${product}.json`),
          JSON.stringify(list)
        );
      });
    });
  }
}

export { Crawler, type CrawlLink, type APIWebsiteInfo };
