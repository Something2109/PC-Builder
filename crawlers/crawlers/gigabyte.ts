import { APIWebsiteInfo, CrawlLink } from "../crawler";
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

const CrawlInfo: APIWebsiteInfo<any, any> = {
  domain,

  save: "parts",

  path(product: Products, page: number = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/Ajax/Product/GetConsumerListPageInfo`);

      const formBody = new FormData();
      formBody.set("ClassKey", mapping[product]);
      formBody.set("PageSize", "500");
      formBody.set("PageNumber", page.toString());

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
      const data = await response.text();
      const dom = new JSDOM(data).window.document;

      links = [...dom.querySelectorAll(".WTB_button")].map((raw) => {
        return {
          url: new URL(
            `${domain}/api/ProductSpec/${raw.getAttribute("data-ProductId")}`
          ),
          type: "product",
          product: link.product,
        };
      });

      if (link.page == 1) {
        pages = Number(dom.querySelector(".pageMaximumPage")?.textContent);
      }
    } else {
      const data = await response.json();
      if (
        !data ||
        !Array.isArray(data.ProductSpecList) ||
        !data.ProductSpecList[0]
      ) {
        throw new Error(`There's possibly a change in the API of ${domain}`);
      }

      list.push(data.ProductSpecList[0]);
    }

    return { list, links, pages };
  },

  parse(raw: {
    Name: string;
    ProductSpecData: { Name: string; Description: string }[];
  }) {
    const result: { [key in string]: string } = {};

    result["Model"] = raw["Name"];
    raw.ProductSpecData.forEach((row) => {
      result[row["Name"]] = row["Description"];
    });

    return result;
  },
};

export default CrawlInfo;
