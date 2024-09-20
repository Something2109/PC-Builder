import { APIWebsiteInfo, CrawlLink } from "../../crawler";
import { Products } from "@/utils/Enum";
import { JSDOM } from "jsdom";

const domain = "https://www.lexar.com";
const mapping: { [key in Products]?: string } = {
  [Products.RAM]: "memory-en-gb",
  [Products.SSD]: "ssd-en-gb",
};

const CrawlInfo: APIWebsiteInfo<Element[], Record<string, string>[]> = {
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
            result: [
              {
                url,
                img: element.querySelector("img")?.getAttribute("src"),
              },
            ],
          };
        }
      );

      return { links };
    },

    product: async (link, response) => {
      const dom = new JSDOM(await response.text()).window.document;
      const list = [];

      const model = dom.querySelector(".product_title")?.textContent;
      const raw = [...dom.querySelectorAll(".product-table")];

      if (raw.length == 0 || !model) {
        throw new Error(`Cannot find content table in ${link.url}`);
      }

      const result = link.result as Record<string, string>;
      result["Model"] = model;

      list.push({ raw, result: [result] });

      return list;
    },
  },

  parse: async ({ raw, result }) => {
    result = result ?? [];
    result.push(
      ...raw.map((table) => {
        const data: Record<string, string> = {};
        const rows = table.querySelectorAll(
          ".wpb_text_column.wpb_content_element"
        );

        for (let i = 0; i < rows.length; i += 2) {
          const title = rows.item(i).textContent;
          const content = rows.item(i + 1).innerHTML;

          if (title && content) {
            data[title] = content;
          }
        }

        return data;
      })
    );

    return result;
  },
};

export default CrawlInfo;
