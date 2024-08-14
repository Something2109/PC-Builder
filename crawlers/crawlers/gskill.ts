import { APIWebsiteInfo } from "../crawler";
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

const CrawlInfo: APIWebsiteInfo<Element, string> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/ajax.php`);

      const formBody = new FormData();
      formBody.set("Func", "firstGetProduct");
      formBody.set("Val", `${mapping[product]}|||${page}`);

      return { url, page, product, method: "POST", body: formBody };
    }

    return null;
  },

  async extract(link, response) {
    const data = await response.json();

    const html = new JSDOM(data["html"]).window.document;
    const page = new JSDOM(data["page"]).window.document.querySelectorAll(
      ".num"
    );

    if (html && page) {
      const list = [...html.querySelectorAll(".item")];
      let pages = null;

      if (link.page == 1) {
        pages = Math.ceil(data["num"] / list.length);
      }

      return { list, pages };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  parse(raw: Element): string {
    return `${domain}${raw.getAttribute("href")}`;
  },
};

export default CrawlInfo;
