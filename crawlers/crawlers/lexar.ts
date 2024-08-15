import { APIWebsiteInfo, CrawlLink } from "../crawler";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://www.lexar.com";
const mapping: { [key in Products]?: string } = {
  [Products.RAM]: "memory-en-gb",
  [Products.SSD]: "ssd-en-gb",
};

const CrawlInfo: APIWebsiteInfo<Element, any> = {
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

  async extract(link, response) {
    const dom = new JSDOM(await response.text()).window.document;
    const list = [];
    let links: CrawlLink[] = [];

    if (link.type == "page") {
      links = [...dom.querySelectorAll(".woocommerce-loop-product__title")].map(
        (element) => {
          return {
            url: new URL(element.getElementsByTagName("a")[0]?.href),
            type: "product",
            product: link.product,
          };
        }
      );
    } else {
      const element = dom.querySelector(".product-table");

      if (!element) {
        throw new Error(`Cannot find content table in ${link.url}`);
      }

      list.push(element);
    }

    return { list, links, pages: null };

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  parse: function (raw) {
    const result: { [key in string]: string } = {};

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
