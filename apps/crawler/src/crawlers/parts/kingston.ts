import { JSDOM } from "jsdom";

import { Products } from "../../types/Enum";
import { APIWebsiteInfo } from "../../types/interface";

const domain = "https://www.kingston.com";
const mapping: { [key in Products]?: string } = {
  [Products.RAM]: "memory",
  [Products.SSD]: "ssd",
};

const CrawlInfo: APIWebsiteInfo<Document, Record<string, string>> = {
  domain,

  save: "parts",

  path(product: Products) {
    if (mapping[product]) {
      const url = new URL(`${domain}/en/${mapping[product]}`);

      return { request: { url }, product };
    }

    return null;
  },

  async extract(response, info) {
    const dom = new JSDOM(await response.text()).window.document;

    // Check for listing page
    if (dom.querySelector(".c-productCard4__image")) {
      const next = [...dom.querySelectorAll(".c-productCard4__image")].map((raw) => {
        const url = new URL(`${domain}${raw.getAttribute("href")}`);
        url.searchParams.set("originalUrl", `${domain}${raw.getAttribute("href")}`);
        const img = raw.querySelector("img")?.getAttribute("src");
        if (img) url.searchParams.set("img", img);

        return {
          request: {
            url,
          },
          product: info.product,
        };
      });
      return { raw: [], next };
    }

    return { raw: [dom], next: [] };
  },

  async parse(raw, info) {
    const result: Record<string, string> = {};
    const url = new URL(
      typeof info.request === "string" ? info.request : (info.request as any).url || info.request
    );
    if (url.searchParams.has("originalUrl")) result["url"] = url.searchParams.get("originalUrl")!;
    if (url.searchParams.has("img")) result["img"] = url.searchParams.get("img")!;
    let table = raw.querySelector(".c-table__main");

    if (!table) {
      throw new Error(`Cannot find content table`);
    }

    let header = table.getElementsByTagName("thead").item(0);
    if (!header) {
      result["Model"] = raw.getElementById("headline")?.textContent!;

      [...table.getElementsByTagName("tr")].forEach((row) => {
        const title = row.children[0];
        const content = row.children[1];

        if (title && title.textContent && content && content.textContent) {
          result[title.textContent.trim()] = content.textContent.trim();
        }
      });
    }

    return result;
  },
};

export default CrawlInfo;
