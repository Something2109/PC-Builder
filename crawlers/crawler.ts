import { Products } from "@/models/interface";

type CrawlLink = {
  url: URL;
  method?: RequestInit["method"];
  body?: RequestInit["body"];
};

type ProductMapping = { [key in Products]?: any[] };

interface APIWebsiteInfo<ResponseType, ReturnType> {
  domain: string;

  /**
   * Create the URL to crawl data from the product enum
   * @param product The product enum to crawl from
   */
  path(product: Products): CrawlLink | null;

  /**
   * Create the next page to continue crawlling data from the previous URL
   * @param url The previous URL
   */
  next(link: CrawlLink): CrawlLink;

  /**
   * Extract the data list from the response object
   * @param response The response object to extract data
   */
  extract(
    response: Response
  ): Promise<{ list: ResponseType[]; pages: number | null }>;

  /**
   * Parse each item from the result of the extract function to the useful data
   * @param raw The raw data object to parse from
   */
  parse(raw: ResponseType): Promise<ReturnType>;
}

class Crawler {
  /**
   * Specify if the parameter object is a crawler object
   * @param object The object to specify
   * @returns True if object is a crawler
   */
  static isCrawlInfo(object?: any): object is APIWebsiteInfo<any, any> {
    return (
      object &&
      "domain" in object &&
      "path" in object &&
      typeof object["path"] == "function" &&
      "next" in object &&
      typeof object.next == "function" &&
      "extract" in object &&
      typeof object.extract == "function" &&
      "parse" in object &&
      typeof object.parse == "function"
    );
  }

  static async crawl(info: APIWebsiteInfo<any, any>): Promise<ProductMapping> {
    const crawler = new WebsiteCrawler(info);

    const result: ProductMapping = {};
    const promises = Object.values(Products).map((product) =>
      crawler.crawl(product).then((data) => {
        if (data.length > 0) result[product as Products] = data;
      })
    );
    await Promise.all(promises);

    return result;
  }
}

class WebsiteCrawler<T> {
  private info: APIWebsiteInfo<unknown, T>;

  constructor(info: APIWebsiteInfo<unknown, T>) {
    this.info = info;
  }

  async crawl(product: Products): Promise<T[]> {
    const link = this.info.path(product);

    try {
      if (link) {
        let response = await this.fetch(link);
        let { list, pages } = await this.info.extract(response);

        list.push(
          ...(pages
            ? await this.crawlParalel(this.info.next(link), --pages)
            : await this.crawlSequential(this.info.next(link)))
        );

        return await Promise.all(list.map((raw) => this.info.parse(raw)));
      }
    } catch (error) {
      console.error(`Error while fetching ${link?.url}`);
      console.error(error);
    }

    return [];
  }

  /**
   * Continuously fetch data from the URL until no new data can be acquired.
   * @param url The URL to fetch data from
   * @returns The data crawled from the URL
   */
  private async crawlSequential(link: CrawlLink): Promise<unknown[]> {
    const result: unknown[] = [];

    let fetching = true;
    while (fetching) {
      let response = await this.fetch(link);
      let { list } = await this.info.extract(response);

      result.push(...list);
      link = this.info.next(link);

      fetching = list.length > 0;
    }

    return result;
  }

  /**
   * Paralelly crawl the data with the specified number of page to fetch
   * @param url The URL to fetch
   * @param pages The number of pages to fetch
   * @returns The data crawled from the URL
   */
  private async crawlParalel(
    link: CrawlLink,
    pages: number
  ): Promise<unknown[]> {
    const result: unknown[] = [];

    if (pages > 0) {
      const promises = [];
      while (pages > 0) {
        promises.push(this.fetch(link));
        link = this.info.next(link);
        pages--;
      }

      const responses = await Promise.all(promises);
      const data = await Promise.all(
        responses.map((res) => this.info.extract(res))
      );
      data.forEach(({ list }) => result.push(...list));
    }

    return result;
  }

  /**
   * Fetch the data from the URL with a number of trying time
   * @param url The URL to fetch data
   * @returns The successful response object or throw error
   */
  private async fetch({ url, method, body }: CrawlLink): Promise<Response> {
    let unsuccess = 0;

    while (unsuccess < 1) {
      const response = await fetch(url, {
        method,
        body,
      });

      if (response.ok) {
        return response;
      }

      unsuccess++;
    }

    throw new Error(`Too many failed attempt at fetching data from ${url}`);
  }
}

export { Crawler, type CrawlLink, type APIWebsiteInfo };
