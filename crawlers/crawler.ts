import { Products } from "../utils/Enum";
import { pipeline, Readable, Transform, Writable } from "stream";

/** Describe types for the crawl info object */

type RequestObject = {
  url: URL;
} & RequestInit;

type BaseInfo = {
  request: RequestObject;
  type: "page" | "product";
  product: Products;
};

type PageCrawlInfo = {
  type: "page";
  page: number;
} & BaseInfo;

type PageCrawlInfoOptions = RequestObject;

type ProductCrawlInfo<ReturnType> = {
  type: "product";
  result?: ReturnType;
} & BaseInfo;

type ProductCrawlInfoOptions<ReturnType> = Pick<
  ProductCrawlInfo<ReturnType>,
  "request" | "result"
>;

type CrawlInfo = PageCrawlInfo | ProductCrawlInfo<any>;

/** Describe required types for the crawl API inferface */

type ExtractFunction<RawType, ReturnType> =
  | GenericExtractFunction<CrawlInfo, DefaultExtractResult<RawType, ReturnType>>
  | {
      page: GenericExtractFunction<
        PageCrawlInfo,
        ExtractPageResult<ReturnType>
      >;

      product: GenericExtractFunction<
        ProductCrawlInfo<ReturnType>,
        ExtractProductResult<RawType>
      >;
    };

type GenericExtractFunction<Link extends CrawlInfo, Result> = (
  link: Link,
  response: Response
) => Promise<Result>;

type DefaultExtractResult<RawType, ReturnType> = {
  list: ExtractProductResult<RawType>;
} & ExtractPageResult<ReturnType>;

type ExtractPageResult<ReturnType> = {
  links: ProductCrawlInfoOptions<ReturnType>[];
  pages?: number;
};

type ExtractProductResult<RawType> = RawType[];

/**
 * The API that all the website crawling object must implement to be
 * used in the crawler.
 */
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
  path(product: Products, page: number): PageCrawlInfoOptions | null;

  /**
   * Extract the data list from the response object.
   */
  extract: ExtractFunction<RawType, ReturnType>;

  /**
   * Parse each item from the result of the extract function to the useful data.
   * @param raw The raw data object to parse from.
   * @param info The crawl info linked to the raw info.
   */
  parse(raw: RawType, info: ProductCrawlInfo<ReturnType>): Promise<ReturnType>;
}

/** Provide the types used in the crawler */

type FetchResult = {
  info: CrawlInfo;
  response: Response;
};

type ExtractResult<RawType, ReturnType> = {
  info: ProductCrawlInfo<ReturnType>;
  raw: RawType;
};

type ParseResult<ReturnType> = Required<ProductCrawlInfo<ReturnType>>;

type TransformCallback<Content> = (err?: Error | null, value?: Content) => void;

const DelayTime = 500;

class Crawler<RawType, FinalType> {
  private readonly info: APIWebsiteInfo<RawType, FinalType>;
  private input: Readable;
  private output: Writable;

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

  constructor(
    info: APIWebsiteInfo<RawType, FinalType>,
    options?: { output?: Writable; error?: Writable }
  ) {
    if (!Crawler.isCrawlInfo(info)) {
      throw new Error("The provided info is not implemented the API");
    }

    this.info = info;
    this.input = new Readable({ objectMode: true, read() {} });
    this.output = options?.output ?? this.createDefaultOutput();
  }

  /**
   * The crawl function.
   * Call this to start the crawling process.
   */
  async crawl(products?: Products[]) {
    const FetchStream = this.createFetchStream().on("error", this.onError);

    const ExtractStream = this.createExtractStream().on("error", this.onError);

    const ParseStream = this.createParseStream().on("error", this.onError);

    pipeline(
      this.input,
      FetchStream,
      ExtractStream,
      ParseStream,
      this.output,
      () => {}
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
    return new Transform({
      objectMode: true,
      autoDestroy: false,
      transform(info: CrawlInfo, _, next: TransformCallback<FetchResult>) {
        console.log(`Fetching: ${info.request.url.toString()}`);

        fetch(info.request.url, info.request).then((response) => {
          setTimeout(() => {
            response.ok
              ? next(null, { info, response })
              : next(new Error(response.statusText));
          }, DelayTime);
        });
      },
    });
  }

  /**
   * Create a stream handling the response extract procedure.
   * The stream takes the input {@link FetchResult}
   * and return back the {@link ExtractResult}
   * of {@link RawType} and {@link FinalType}.
   * @returns The extract stream created.
   */
  private createExtractStream() {
    const extract = this.extract.bind(this);

    return new Transform({
      objectMode: true,
      autoDestroy: false,
      transform(
        { info, response }: FetchResult,
        _,
        callback: TransformCallback<ExtractResult<RawType, FinalType>>
      ) {
        extract(info, response).then((list) => {
          list.forEach((raw) => this.push({ info, raw }));
          callback();
        });
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
      transform(
        chunk: ExtractResult<RawType, FinalType>,
        _,
        callback: TransformCallback<ParseResult<FinalType>>
      ) {
        parse(chunk).then((value) => {
          callback(null, value);
        });
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
      write(chunk: ParseResult<FinalType>, _, callback) {
        process.stdout.write(`${JSON.stringify(chunk)}\n`);
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
      const request = this.info.path(product, 1);
      if (request) {
        this.input.push(this.createPageLink(product, request, 1));
      }
    });
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
    info: CrawlInfo,
    response: Response
  ): Promise<RawType[]> {
    console.log(`Extracting: ${info.request.url.toString()}`);

    let links: ProductCrawlInfoOptions<FinalType>[] = [],
      list: RawType[] = [],
      pages;

    if (typeof this.info.extract === "function") {
      ({ links, list, pages } = await this.info.extract(info, response));
    } else if (info.type === "page") {
      ({ links, pages } = await this.info.extract.page(info, response));
    } else {
      list = await this.info.extract.product(info, response);
    }

    if (info.type == "page" && pages && (list.length > 0 || links.length > 0)) {
      this.next(info, pages);
    }

    links.forEach((element) => {
      this.input.push(this.createProductLink(info.product, element));
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
  }: ExtractResult<RawType, FinalType>): Promise<ParseResult<FinalType>> {
    console.log(`Parsing ${info.request.url.toString()}`);

    info.result = await this.info.parse(raw, info);

    return info as ParseResult<FinalType>;
  }

  /**
   * Get the next requests of the request data and
   * push it to the request queue.
   * @param info The current request object.
   * @param pages The number of next requests from the current one.
   */
  private next(info: PageCrawlInfo, pages: number) {
    let nextPage = info.page;
    while (nextPage < pages) {
      nextPage++;
      this.input.push(
        this.createPageLink(
          info.product,
          this.info.path(info.product, nextPage)!,
          nextPage
        )
      );
    }
  }

  /**
   * Create a page link object from the parameters.
   * @param product The product of the page link.
   * @param request The request object of the link.
   * @param page The page number the request represented.
   * @returns The page link object created.
   */
  private createPageLink(
    product: Products,
    request: RequestObject,
    page: number
  ): PageCrawlInfo {
    return { type: "page", product, request, page };
  }

  /**
   * Create a product link object from the parameters.
   * @param product The product of the product link.
   * @param options The options to create product link.
   * @returns The product link object created.
   */
  private createProductLink(
    product: Products,
    options: ProductCrawlInfoOptions<FinalType>
  ): ProductCrawlInfo<FinalType> {
    return { type: "product", product, ...options };
  }

  private onError(error: Error) {
    console.error(error);
  }
}

export { Crawler, type CrawlInfo as CrawlLink, type APIWebsiteInfo };
