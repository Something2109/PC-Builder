import { APIWebsiteInfo } from "../../crawler";
import {
  RetailProductSchema,
  RetailProductType,
} from "../../../utils/interface/retailer/Product";
import { Products } from "../../../utils/Enum";
import { JSDOM } from "jsdom";

const domain = "https://memoryzone.com.vn";
const mapping: { [key in Products]?: string } = {
  [Products.CPU]: "cpu-may-tinh",
  [Products.GRAPHIC_CARD]: "vga",
  [Products.MAIN]: "mainboard-pc",
  [Products.RAM]: "ram-pc",
  [Products.SSD]: "ssd",
  [Products.HDD]: "hdd",
  [Products.PSU]: "psu-nguon-may-tinh",
  [Products.CASE]: "case-may-tinh",
  [Products.COOLER]: "tan-nhiet-fan-case",
  [Products.AIO]: "tan-nhiet-fan-case",
  [Products.FAN]: "tan-nhiet-fan-case",
};

const CrawlInfo: APIWebsiteInfo<Element, RetailProductType> = {
  domain,

  save: "sellers",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/${mapping[product]}`);
      url.searchParams.set("page", page.toString());

      return { url };
    }

    return null;
  },

  async extract(link, response) {
    const dom = new JSDOM(await response.text()).window.document;
    const itemContainer = dom.querySelector(".product-list");

    let list: Element[] = [];
    let pages;

    if (link.type == "page" && itemContainer) {
      list = [...itemContainer.querySelectorAll(".product-col")];

      if (link.page == 1) {
        const pageList = dom.querySelectorAll(".page-item");
        const total =
          pageList.length == 0
            ? 1
            : pageList.item(pageList.length - 2).textContent;

        pages = Number(total);
      }
    }

    return { list, links: [], pages };
  },

  async parse(raw) {
    const name = raw.querySelector(".product-name")?.textContent!;
    const link = `${domain}${raw
      .querySelector(".image_thumb")
      ?.getAttribute("href")}`;
    const img = `https:${raw
      .querySelector(".product-thumbnail__img")
      ?.getAttribute("src")}`;
    let price = 0;
    const availability = Boolean(raw.querySelector(".price"));

    if (availability) {
      price = Number(
        raw
          .querySelector(".price")!
          .textContent?.replaceAll(".", "")
          .match(/\d+/)
      );
    }

    return RetailProductSchema.parse({ name, price, link, img, availability });
  },
};

export default CrawlInfo;
