import { APIWebsiteInfo, CrawlLink } from "../../crawler";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://www.gskill.com";
const mapping: { [key in Products]?: string } = {
  // [Products.RAM]: "165",
  [Products.SSD]: "9",
  [Products.PSU]: "90",
  [Products.CASE]: "365",
  [Products.AIO]: "353",
};

const CrawlInfo: APIWebsiteInfo<Element, Record<string, string>> = {
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

  extract: {
    page: async (link, response) => {
      let links: CrawlLink[] = [];
      let pages;

      const data = await response.json();

      const html = new JSDOM(data["html"]).window.document;
      links = [...html.querySelectorAll(".list")].map((raw) => {
        const url = `${domain}${raw
          .querySelector(".item")!
          .getAttribute("href")}`;

        return {
          url: new URL(
            `${url.replace("product", "specification")}-Specification`
          ),
          type: "product",
          product: link.product,
          result: {
            url,
            img: `${domain}${raw
              .querySelector(".block-img img")
              ?.getAttribute("src")}`,
          },
        };
      });

      if (link.page == 1) {
        pages = Math.ceil(data["num"] / links.length);
      }

      return { links, pages };
    },

    product: async (link, response) => {
      const list = [];

      const dom = new JSDOM(await response.text()).window.document;

      const table = dom.querySelector(".list-inner");
      if (!table) {
        throw new Error(`Cannot find content table in ${link.url}`);
      }

      list.push({
        raw: table,
        result: link.result as Record<string, string>,
      });

      return list;
    },
  },

  parse({ raw, result }) {
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
