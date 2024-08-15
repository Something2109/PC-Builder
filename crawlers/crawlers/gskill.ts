import { APIWebsiteInfo, CrawlLink } from "../crawler";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://www.gskill.com";
const mapping: { [key in Products]?: string } = {
  [Products.RAM]: "165",
  [Products.SSD]: "9",
  [Products.PSU]: "90",
  [Products.CASE]: "365",
  [Products.AIO]: "353",
};

const CrawlInfo: APIWebsiteInfo<Element, any> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/ajax.php`);

      const formBody = new FormData();
      formBody.set("Func", "firstGetProduct");
      formBody.set("Val", `${mapping[product]}|||${page}`);

      return {
        url,
        type: "page",
        page,
        product,
        method: "POST",
        body: formBody,
      };
    }

    return null;
  },

  async extract(link, response) {
    const list = [];
    let links: CrawlLink[] = [];
    let pages = null;

    if (link.type == "page") {
      const data = await response.json();

      const html = new JSDOM(data["html"]).window.document;
      links = [...html.querySelectorAll(".item")].map((raw) => {
        return {
          url: new URL(
            `${domain}${raw
              .getAttribute("href")
              ?.replace("product", "specification")}-Specification`
          ),
          type: "product",
          product: link.product,
        };
      });

      if (link.page == 1) {
        pages = Math.ceil(data["num"] / links.length);
      }
    } else {
      const dom = new JSDOM(await response.text()).window.document;

      const table = dom.querySelector(".list-inner");
      if (!table) {
        throw new Error(`Cannot find content table in ${link.url}`);
      }

      list.push(table);
    }

    return { list, links, pages };
  },

  parse(raw: Element) {
    const result: { [key in string]: string } = {};

    raw.querySelectorAll(".list-descr").forEach((row) => {
      const [title, content] = row.querySelectorAll(".list-block");
      if (title && content && title.textContent && content.textContent) {
        result[title.textContent] = content.textContent;
      }
    });

    return result;
  },
};

export default CrawlInfo;
