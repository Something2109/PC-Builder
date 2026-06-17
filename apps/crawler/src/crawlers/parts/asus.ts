import { JSDOM } from "jsdom";

import { Products } from "../../types/Enum";
import { APIWebsiteInfo } from "../../types/interface";

const domain = "https://odinapi.asus.com";
const mapping: { [key in Products]?: string } = {
  [Products.GRAPHIC_CARD]: "graphics-cards",
  [Products.MAIN]: "motherboards",
  [Products.PSU]: "power-supply-units",
  [Products.CASE]: "cases",
  [Products.AIO]: "cooling",
};

const CrawlInfo: APIWebsiteInfo<Element, Record<string, string>> = {
  domain,

  save: "parts",

  path(product: Products) {
    if (mapping[product]) {
      const url = new URL(`${domain}/recent-data/apiv2/SeriesFilterResult`);

      url.searchParams.set("SystemCode", "asus");
      url.searchParams.set("WebsiteCode", "global");
      url.searchParams.set("ProductLevel1Code", "motherboards-components");
      url.searchParams.set("ProductLevel2Code", mapping[product]);

      return { request: { url }, product };
    }

    return null;
  },

  async extract(response, info) {
    const requestUrl = new URL(
      typeof info.request === "string" ? info.request : (info.request as any).url || info.request
    );

    if (requestUrl.toString().includes("SeriesFilterResult")) {
      const data = await response.json();
      if (!data || !data.Result || !Array.isArray(data.Result.ProductList)) {
        throw new Error(`There's possibly a change in the API of ${domain}`);
      }

      const next = data.Result.ProductList.map((raw: { ProductURL: string }) => {
        const url: string = raw.ProductURL;
        const requestUrl = new URL(`${url}${url.includes("rog") ? "" : "tech"}spec`);
        requestUrl.searchParams.set("originalUrl", url);

        return {
          request: {
            url: requestUrl,
          },
          product: info.product,
        };
      });

      return { raw: [], next };
    }

    const list: Element[] = [];

    const dom = new JSDOM(await response.text()).window.document;
    const url = new URL(
      typeof info.request === "string" ? info.request : (info.request as any).url || info.request
    );
    let table = dom.getElementById("productTableBody");
    if (url.hostname.includes("rog")) {
      table = dom.querySelector(".specContent");
    }

    if (!table) {
      throw new Error(`Cannot find content table in ${url}`);
    }

    list.push(table);

    return { raw: list, next: [] };
  },

  async parse(raw, info) {
    const result: Record<string, string> = {
      Model: "",
    };
    const url = new URL(
      typeof info.request === "string" ? info.request : (info.request as any).url || info.request
    );
    if (url.searchParams.has("originalUrl")) {
      // url might be in result? No, we used it for link presumably?
      // Actually existing code logic for result['Model'] below handles some of it?
      // existing code used result from link?
      // No, existing code used info.result for url?
      // Actually asus.ts line 48: result: { url }.
      // line 76: const result = info.result ?? {};
      // line 93: result["Model"] = ...
      // So result was accumulator.
    }

    let rowClass = ".TechSpec__rowTable__1LR9D",
      titleClass = ".rowTableTitle",
      contentClass = ".rowTableItemViewBox",
      imgClass = ".TechSpec__rowTableItems__KYWXp.TechSpec__rowImage__35vd6 img";

    if (raw.id !== "productTableBody") {
      rowClass = ".ProductSpecSingle__productSpecItemRow__BKwUK";
      titleClass = ".ProductSpecSingle__productSpecItemTitle__HKAZq";
      contentClass = ".ProductSpecSingle__productSpecItemContent__oJI5w";
      imgClass = ".ProductSpecSingle__productSpecItemImage__dtblM img";

      result["Model"] = raw
        .querySelector(".ProductSpecSingle__specProductName__bl-tB")
        ?.textContent?.trim()!;
    }

    result["img"] = raw.querySelector(imgClass)?.getAttribute("src")!;
    raw.querySelectorAll(rowClass).forEach((row: Element) => {
      const title = row.querySelector(titleClass);
      const content = row.querySelector(contentClass);
      if (title && title.textContent && content && content.textContent) {
        result[title.textContent.trim()] = content.textContent.trim();
      }
    });
    return result;
  },
};

export default CrawlInfo;
