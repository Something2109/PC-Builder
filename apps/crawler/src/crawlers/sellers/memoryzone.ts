import { JSDOM } from "jsdom";

import { Products } from "../../utils/Enum";
import {
  RetailProductSchema,
  RetailProductType,
} from "../../utils/interface/retailer/Product";
import { APIWebsiteInfo } from "../../interface";

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

      return { request: url, product };
    }

    return null;
  },

  async extract(response, info) {
    const dom = new JSDOM(await response.text()).window.document;
    const itemContainer = dom.querySelector(".product-list");

    let list: Element[] = [];

    if (itemContainer) {
      list = [...itemContainer.querySelectorAll(".product-col")];

      const url = new URL(info.request as string);
      const page = Number(url.searchParams.get("page"));

      return {
        raw: list,
        next: list.length ? [this.path!(info.product, page + 1)!] : [],
      };
    }

    return { raw: list, next: [] };
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
