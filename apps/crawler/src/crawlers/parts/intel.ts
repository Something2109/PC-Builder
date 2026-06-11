import { JSDOM } from "jsdom";

import { Products } from "../../types/Enum";
import { APIWebsiteInfo } from "../../types/interface";

const domain = "https://ark.intel.com";
const mapping: { [key in Products]?: string } = {
  [Products.CPU]: "873",
};

const CrawlInfo: APIWebsiteInfo<Document, any> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(
        `${domain}/libs/apps/intel/support/ark/advancedFilterSearch`
      );
      url.searchParams.set("productType", mapping[product]);
      url.searchParams.set(
        "forwardPath",
        "/content/www/us/en/ark/search/featurefilter.html"
      );
      url.searchParams.set("pageNo", page.toString());

      return { request: { url }, product };
    }

    return null;
  },

  async extract(response, info) {
    const text = await response.text();
    const dom = new JSDOM(text).window.document;

    // Check if it's a search page
    const productList = dom.querySelectorAll(
      ".ark-product-name.ark-accessible-color.component a"
    );
    const requestUrl = new URL(
      typeof info.request === "string"
        ? info.request
        : (info.request as any).url || info.request
    );

    if (
      productList.length > 0 &&
      requestUrl.toString().includes("advancedFilterSearch")
    ) {
      const next = [...productList].map((element) => {
        return {
          request: { url: new URL(`${domain}${element.getAttribute("href")}`) },
          product: info.product,
        };
      });
      return { raw: [], next };
    }

    const element = dom.querySelector(".specs-blade.specifications");

    if (!element) {
      // Only throw if we expected product page?
      // Reuse exception logic
      const urlStr =
        typeof info.request === "string"
          ? info.request
          : (info.request as any).url?.toString() || info.request.toString();
      throw new Error(`Cannot find content table in ${urlStr}`);
    }

    return { raw: [dom], next: [] }; // Raw is Document
  },

  async parse(raw) {
    const result: any = {};
    const title = raw.querySelector(".product-family-title-text .h1");

    if (title && title.textContent) {
      result["Model"] = title.textContent;
    }
    raw.querySelectorAll(".specs-blade.specifications").forEach((spec) => {
      spec.querySelectorAll(".blade-inside ul li").forEach((row) => {
        const N = row.querySelector(".label");
        const V = row.querySelector(".value");

        if (N && V && N.textContent && V.textContent) {
          let title = N.textContent.trim();
          title = title
            .replace("\x3c", "\x26lt;")
            .replace("(", "(")
            .replace("^", "^")
            .replace("\x3e", "\x26gt;");
          let content = V.textContent.trim();
          content = content
            .replace("\x3c", "\x26lt;")
            .replace("(", "(")
            .replace("^", "^")
            .replace("\x3e", "\x26gt;");
          result[title] = content.replaceAll(",", " | ");
        }
      });
    });

    return result;
  },
};

export default CrawlInfo;
