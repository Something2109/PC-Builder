import path from "path";
import fs from "fs";
import { Products } from "@/utils/Enum";

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
  result?: unknown;
} & BaseLink;

type CrawlLink = PageLink | ProductLink;

type ExtractFunction<RawType, ReturnType> =
  | DefaultExtractFunction<RawType, ReturnType>
  | {
      page: ExtractPageFunction;

      product: ExtractProductFunction<RawType, ReturnType>;
    };

type DefaultExtractFunction<RawType, ReturnType> = (
  link: CrawlLink,
  response: Response
) => Promise<{
  list: ParseInput<RawType, ReturnType>[];
  links: CrawlLink[];
  pages?: number;
}>;

type ExtractPageFunction = (
  link: PageLink,
  response: Response
) => Promise<{
  links: CrawlLink[];
  pages?: number;
}>;

type ExtractProductFunction<RawType, ReturnType> = (
  link: ProductLink,
  response: Response
) => Promise<ParseInput<RawType, ReturnType>[]>;

type ParseInput<RawType, ReturnType> = {
  raw: RawType;
  result?: ReturnType;
};

type Result<T> = {
  product: Products;
  list: T[];
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
  path(product: Products, page: number): CrawlLink | null;

  /**
   * Extract the data list from the response object.
   * @param response The response object to extract data.
   */
  extract: ExtractFunction<RawType, ReturnType>;

  /**
   * Parse each item from the result of the extract function to the useful data.
   * @param raw The raw data object to parse from.
   */
  parse(input: ParseInput<RawType, ReturnType>): Promise<ReturnType>;
}

const FetchEachLoop = 10;
const DelayTime = 5000;

class Crawler<RawType, ReturnType> {
  private readonly info: APIWebsiteInfo<RawType, ReturnType>;
  private dataPath = path.join(".", "data");
  private requests: CrawlLink[] = [];
  private errors: { link: CrawlLink; error: unknown }[] = [];

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
      (typeof object.extract == "function" ||
        (typeof object.extract == "object" &&
          object.extract.page &&
          object.extract.product)) &&
      "parse" in object &&
      typeof object.parse == "function"
    );
  }

  constructor(info: APIWebsiteInfo<RawType, ReturnType>) {
    this.info = info;
  }

  /**
   * The crawl function.
   * Call this to start the crawling process.
   */
  async crawl(products?: Products[]) {
    if (!this.info) {
      throw new Error("No website info specified");
    }

    this.start(products);

    const result: Result<ReturnType>[] = [];

    while (this.requests.length > 0) {
      const promises = this.requests
        .splice(0, FetchEachLoop)
        .map((link) => this.fetchRequest(link));

      const responses = (await Promise.all(promises)).filter(
        (result) => result != null
      );

      const returnResult = responses.map(({ list, product }) =>
        Promise.all(list.map((raw) => this.parseRaw(raw))).then((result) => ({
          list: result.filter((value) => value !== null),
          product,
        }))
      );

      result.push(...(await Promise.all(returnResult)));

      await new Promise((resolve) => setTimeout(resolve, DelayTime));
    }

    const data = this.map(result);
    this.save(data);

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
  private start(products?: Products[]) {
    if (!products) {
      products = Object.values(Products);
    }

    Object.values(Products).map((product) => {
      const link = this.info.path(product, 1);
      if (link) {
        this.requests.push(link);
      }
    });
  }

  /**
   * The fetching process of a request.
   * @param param The request object of the process.
   * @returns The result of the process.
   */
  private async fetchRequest(
    link: CrawlLink
  ): Promise<Result<ParseInput<RawType, ReturnType>> | null> {
    const { url, method, body } = link;

    console.log(`fetching ${url}`);
    try {
      const response = await fetch(url, { method, body });
      if (!response.ok) {
        throw new Error(`Response code: ${response.status}`);
      }

      let list: ParseInput<RawType, ReturnType>[] = [],
        links: CrawlLink[] = [],
        pages;

      if (typeof this.info.extract === "function") {
        ({ list, links, pages } = await this.info.extract(link, response));
      } else if (link.type === "page") {
        ({ links, pages } = await this.info.extract.page(link, response));
      } else {
        list = await this.info.extract.product(link, response);
      }

      if (
        link.type == "page" &&
        pages &&
        (list.length > 0 || links.length > 0)
      ) {
        this.next(link, pages);
      }

      this.requests.push(...links);

      return {
        product: link.product,
        list,
      };
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Error crawling ${link.url.toString()}.`);
      console.error(error);
      this.errors.push({ link, error: error.message });
    }

    return null;
  }

  private async parseRaw(
    raw: ParseInput<RawType, ReturnType>
  ): Promise<ReturnType | null> {
    try {
      return await this.info.parse(raw);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Error parsing ${raw}.`);
      console.error(error);
    }
    return null;
  }

  /**
   * Get the next requests of the request data and
   * push it to the request queue.
   * @param param0 The current request object.
   * @param pages The number of next requests from the current one.
   */
  private next(link: PageLink, pages: number) {
    let nextPage = link.page;
    while (nextPage < pages) {
      nextPage++;
      this.requests.push(this.info.path(link.product, nextPage)!);
    }
  }

  /**
   * Map the crawled data based on the origin website and the product type.
   * @param result The result of the requests.
   * @returns The mapped data object.
   */
  private map(result: Result<ReturnType>[]): Record<string, ProductMapping> {
    const data: Record<string, ProductMapping> = {};

    result.forEach(({ product, list }) => {
      const key = path.join(
        this.info.save,
        this.info.domain.replaceAll(/(https:\/\/|www.|\.com|\.vn|\.)+/g, "")
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
  private save(result: Record<string, ProductMapping>) {
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
