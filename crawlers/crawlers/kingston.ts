import { APIWebsiteInfo, CrawlLink } from "../crawler";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://www.kingston.com";
const mapping: { [key in Products]?: string } = {
  [Products.RAM]: "memory",
  [Products.SSD]: "ssd",
};

const CrawlInfo: APIWebsiteInfo<Document, any> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/en/${mapping[product]}`);

      return { url, type: "page", page, product };
    }

    return null;
  },

  async extract(link, response) {
    const list = [];
    let links: CrawlLink[] = [];
    let pages = null;

    const dom = new JSDOM(await response.text()).window.document;

    if (link.type == "page") {
      links = [...dom.querySelectorAll(".c-productCard4__header__link")].map(
        (raw) => {
          console.log(raw.getAttribute("href"));
          return {
            url: new URL(`${domain}${raw.getAttribute("href")}`),
            type: "product",
            product: link.product,
          };
        }
      );
    } else {
      list.push(dom);
    }

    return { list, links, pages };
  },

  parse(raw) {
    const result: { [key in string]: string } = {};

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
