import { APIWebsiteInfo, CrawlLink } from "../../crawler";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://www.lexar.com";
const mapping: { [key in Products]?: string } = {
  [Products.RAM]: "memory-en-gb",
  [Products.SSD]: "ssd-en-gb",
};

const CrawlInfo: APIWebsiteInfo<Element, Record<string, string>> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(
        `${domain}/product-category/${mapping[product]}/page/${page}`
      );

      return { url, type: "page", page, product };
    }

    return null;
  },

  extract: {
    page: async (link, response) => {
      let links: CrawlLink[] = [];

      const dom = new JSDOM(await response.text()).window.document;
      links = [...dom.querySelectorAll(".product.type-product")].map(
        (element) => {
          const url = element.querySelector("a")!.getAttribute("href")!;
          console.log(url);
          return {
            url: new URL(url),
            type: "product",
            product: link.product,
            result: {
              url,
              img: element.querySelector("img")?.getAttribute("src"),
            },
          };
        }
      );

      return { links };
    },

    product: async (link, response) => {
      const dom = new JSDOM(await response.text()).window.document;
      const list = [];

      const element = dom.querySelector(".product-table");

      if (!element) {
        throw new Error(`Cannot find content table in ${link.url}`);
      }

      list.push({
        raw: element,
        result: link.result as Record<string, string>,
      });

      return list;
    },
  },

  parse: function ({ raw, result }) {
    const rows = raw.querySelectorAll(".wpb_text_column.wpb_content_element");

    for (let i = 0; i < rows.length; i += 2) {
      const title = rows.item(i).textContent;
      const content = rows.item(i + 1).textContent;

      if (title && content) {
        result[title] = content;
      }
    }

    return result;
  },
};

export default CrawlInfo;
