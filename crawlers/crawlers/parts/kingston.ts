import { APIWebsiteInfo, CrawlLink } from "../../crawler";
import { Products } from "@/utils/Enum";
import { JSDOM } from "jsdom";

const domain = "https://www.kingston.com";
const mapping: { [key in Products]?: string } = {
  [Products.RAM]: "memory",
  [Products.SSD]: "ssd",
};

const CrawlInfo: APIWebsiteInfo<Document, Record<string, string>> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/en/${mapping[product]}`);

      return { url, type: "page", page, product };
    }

    return null;
  },

  extract: {
    page: async (link, response) => {
      let links: CrawlLink[] = [];

      const dom = new JSDOM(await response.text()).window.document;

      links = [...dom.querySelectorAll(".c-productCard4__image")].map((raw) => {
        return {
          url: new URL(`${domain}${raw.getAttribute("href")}`),
          type: "product",
          product: link.product,
          result: {
            url: `${domain}${raw.getAttribute("href")}`,
            img: `${raw.querySelector("img")?.getAttribute("src")}`,
          },
        };
      });

      return { links };
    },

    product: async (link, response) => {
      const list = [];

      const dom = new JSDOM(await response.text()).window.document;

      list.push({ raw: dom, result: link.result as Record<string, string> });

      return list;
    },
  },

  async parse({ raw, result }) {
    let table = raw.querySelector(".c-table__main");
    result = result ?? {};

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
