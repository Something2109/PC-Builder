import { APIWebsiteInfo, CrawlLink } from "../crawler";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://odinapi.asus.com";
const mapping: { [key in Products]?: string } = {
  [Products.GPU]: "graphics-cards",
  [Products.MAIN]: "motherboards",
  [Products.PSU]: "power-supply-units",
  [Products.CASE]: "cases",
  [Products.AIO]: "cooling",
};

const CrawlInfo: APIWebsiteInfo<Element, any> = {
  domain,

  save: "parts",

  path(product: Products) {
    if (mapping[product]) {
      const url = new URL(`${domain}/recent-data/apiv2/SeriesFilterResult`);

      url.searchParams.set("SystemCode", "asus");
      url.searchParams.set("WebsiteCode", "global");
      url.searchParams.set("ProductLevel1Code", "motherboards-components");
      url.searchParams.set("ProductLevel2Code", mapping[product]);

      return { url, type: "page", page: 1, product };
    }

    return null;
  },

  async extract(link, response) {
    const list: Element[] = [];
    let links: CrawlLink[] = [];

    if (link.type == "page") {
      const data = await response.json();
      if (!data || !data.Result || !Array.isArray(data.Result.ProductList)) {
        throw new Error(`There's possibly a change in the API of ${domain}`);
      }

      links = data.Result.ProductList.map((raw: { ProductURL: string }) => {
        const url: string = raw.ProductURL;
        return {
          url: new URL(`${url}${url.includes("rog") ? "" : "tech"}spec`),
          type: "product",
          product: link.product,
        };
      });
    } else {
      const dom = new JSDOM(await response.text()).window.document;

      let table = dom.getElementById("productTableBody");
      if (link.url.hostname.includes("rog")) {
        table = dom.querySelector(".specContent");
      }

      if (!table) {
        throw new Error(`Cannot find content table in ${link.url}`);
      }

      list.push(table);
    }

    return { list, links, pages: null };
  },

  parse(raw: Element) {
    const result: { [key in string]: string } = {};
    let rowClass = ".TechSpec__rowTable__1LR9D",
      titleClass = ".rowTableTitle",
      contentClass = ".rowTableItemViewBox",
      imgClass =
        ".TechSpec__rowTableItems__KYWXp.TechSpec__rowImage__35vd6 img";

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
