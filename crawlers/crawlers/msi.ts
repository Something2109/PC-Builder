import { APIWebsiteInfo } from "../crawler";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://www.msi.com";
const mapping: { [key in Products]?: string } = {
  [Products.GPU]: "vga",
  [Products.MAIN]: "mb",
  [Products.SSD]: "storage",
  [Products.PSU]: "Power-Supply",
  [Products.CASE]: "pcc",
  [Products.AIO]: "Liquid-Cooling",
};

const CrawlInfo: APIWebsiteInfo<Element, any> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/api/v1/product/getProductList`);

      url.searchParams.set("product_line", mapping[product]!);
      url.searchParams.set("page_number", page.toString());
      url.searchParams.set("page_size", "500");

      return { url, type: "page", page, product };
    }

    return null;
  },

  async extract(link, response) {
    const list = [];
    let links = [];
    let pages = null;

    if (link.type == "page") {
      const data = await response.json();

      if (!Array.isArray(data.result.getProductList)) {
        throw new Error(`There's possibly a change in the API of ${domain}`);
      }

      links = data.result.getProductList.map(
        (raw: { product_line: string; link: string }) => {
          return {
            url: new URL(
              `${domain}/${raw["product_line"]}/${raw["link"]}/Specification`
            ),
            type: "product",
            product: link.product,
          };
        }
      );

      if (link.page == 1) {
        pages =
          Math.ceil(data.result.count / data.result.getProductList.length) ?? 0;
      }
    } else {
      const dom = new JSDOM(await response.text()).window.document;

      let table = dom.getElementById("product");

      if (!table) {
        throw new Error(`Cannot find content table in ${link.url}`);
      }

      list.push(table);
    }

    return { list, links, pages };
  },

  parse: function (raw: Element) {
    const result: { [key in string]: string } = {};

    const model = raw.querySelector(".text-center h3")?.textContent;
    if (model) {
      result["Model"] = model;
    }

    const imgSrc = raw.querySelector(".img-container img")?.getAttribute("src");
    if (imgSrc) {
      result["img"] = imgSrc;
    }

    let table = raw.querySelector(".table-specifications");
    if (table) {
      raw.querySelectorAll(".row").forEach((row) => {
        const title = row.children[0];
        const content = row.children[1];

        if (title && content && title.textContent && content.textContent) {
          result[title.textContent.trim()] = content.textContent.trim();
        }
      });
    } else {
      table = raw.querySelector(".pdtb");
      raw.querySelectorAll(".td").forEach((row) => {
        const title = row.removeChild(row.children[0]);
        if (title && title.textContent && row.textContent) {
          result[title.textContent.trim()] = row.textContent.trim();
        }
      });
    }

    return result;
  },
};

export default CrawlInfo;
