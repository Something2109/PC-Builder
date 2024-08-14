import { APIWebsiteInfo } from "../crawler";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://www.gigabyte.com";
const mapping: { [key in Products]?: string } = {
  [Products.GPU]: "3",
  [Products.MAIN]: "2",
  [Products.RAM]: "53",
  [Products.SSD]: "54",
  [Products.PSU]: "41",
  [Products.CASE]: "9",
  [Products.AIO]: "40",
};

const CrawlInfo: APIWebsiteInfo<Element, string> = {
  domain,

  save: "parts",

  path(product: Products, page: number = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/Ajax/Product/GetConsumerListPageInfo`);

      const formBody = new FormData();
      formBody.set("ClassKey", mapping[product]);
      formBody.set("PageSize", "500");
      formBody.set("PageNumber", page.toString());

      return { url, page, product, method: "POST", body: formBody };
    }

    return null;
  },

  async extract(link, response) {
    const data = await response.text();

    const html = new JSDOM(data).window.document;

    if (html) {
      const list = [...html.querySelectorAll(".product_list_box")];
      let pages = null;

      if (link.page == 1) {
        pages = Number(html.querySelector(".pageMaximumPage")?.textContent);
      }

      return { list, pages };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  parse(raw: Element): string {
    const info = raw.querySelector(".product_info_text_col");

    return `${domain}${info?.getElementsByTagName("a").item(0)?.href}`;
  },
};

export default CrawlInfo;
