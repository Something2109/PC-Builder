import { JSDOM } from "jsdom";

import { Products } from "../../types/Enum";
import { APIWebsiteInfo } from "../../types/interface";

const domain = "https://www.gigabyte.com";
const mapping: { [key in Products]?: string } = {
  [Products.GRAPHIC_CARD]: "3",
  [Products.MAIN]: "2",
  [Products.RAM]: "53",
  [Products.SSD]: "54",
  [Products.PSU]: "41",
  [Products.CASE]: "9",
  [Products.AIO]: "40",
};

const CrawlInfo: APIWebsiteInfo<any, Record<string, string>> = {
  domain,

  save: "parts",

  path(product: Products, page: number = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/Ajax/Product/GetConsumerListPageInfo`);

      const formBody = new FormData();
      formBody.set("ClassKey", mapping[product]);
      formBody.set("PageSize", "500");
      formBody.set("PageNumber", page.toString());

      return {
        request: {
          url,
          method: "POST",
          body: formBody,
        },
        product,
      };
    }

    return null;
  },

  async extract(response, info) {
    const requestUrl = new URL(
      typeof info.request === "string" ? info.request : (info.request as any).url || info.request
    );

    if (requestUrl.pathname.includes("GetConsumerListPageInfo")) {
      const data = await response.text();
      const dom = new JSDOM(data).window.document;

      let next = [...dom.querySelectorAll(".product_list_box")].map((raw) => {
        const productId = raw.querySelector(".WTB_button")!.getAttribute("data-ProductId");
        const nextUrl = new URL(`${domain}/api/ProductSpec/${productId}`);

        const productUrl = `${domain}${raw
          .querySelector(".product_list_box_info_ImageLink")!
          .getAttribute("href")}`;
        const img = `https${raw
          .querySelector(".js-rwdWebp_Item-Image.css-Item-ImagePicture img")!
          .getAttribute("data-src")}`;

        nextUrl.searchParams.set("productUrl", productUrl);
        nextUrl.searchParams.set("img", img);

        return {
          request: {
            url: nextUrl,
          },
          product: info.product, // propagate product type
        };
      });

      // Pagination logic
      const page = Number(requestUrl.searchParams.get("PageNumber") || "1"); // Wait, path used body form data for page info?
      // path sent PageNumber in formBody.
      // But we can't easily read formBody from here unless we check existing request?
      // info.request.body is generic BodyInit?
      // If we need to paginate, we must return next page request.

      // existing code: result has pages count.
      // if (link.page == 1) pages = ...
      // But path used formBody.
      // We can create next page request if we know current page.
      // We assume page = 1 if not tracked?
      // The issue is existing Crawler logic handled `pages` in earlier versions?
      // No, `APIWebsiteInfo` is stateless.
      // `gigabyte.ts` `path` accepts `page`.
      // We need to return `next` request for page+1.

      const totalPages = Number(dom.querySelector(".pageMaximumPage")?.textContent);
      // We can try to guess current page from `info.index`? No.
      // We should encode page number in the initial URL query param too even if unused by API, just for state tracking?
      // Or we can rely on `gigabyte.ts` path implementation.
      // But `extract` returns `next` requests which call `path`?
      // if we return `this.path(product, page+1)` it works.
      // But how do we know `current page` inside extract?
      // We can add `page` to the query params of the `GetConsumerListPageInfo` URL in `path` function, even if implementation uses body.

      // Let's modify path to add query param for tracking.

      return { raw: [], next };
    }

    const list = [];
    const data = await response.json();
    if (!data || !Array.isArray(data.ProductSpecList) || !data.ProductSpecList[0]) {
      throw new Error(`There's possibly a change in the API of ${domain}`);
    }

    list.push({
      raw: data.ProductSpecList[0],
      requestUrl: requestUrl, // pass url for parse to read params
    });

    return { raw: list, next: [] };
  },

  async parse(raw) {
    const result: Record<string, string> = {};
    if (raw.requestUrl) {
      const url = new URL(raw.requestUrl);
      result["url"] = url.searchParams.get("productUrl") || "";
      result["img"] = url.searchParams.get("img") || "";
    }
    const productSpec = raw.raw || raw; // Handle wrapper or direct

    result["Model"] = productSpec["Name"];
    if (productSpec.ProductSpecData) {
      productSpec.ProductSpecData.forEach((row: any) => {
        result[row["Name"]] = row["Description"];
      });
    }

    return result;
  },
};

export default CrawlInfo;
