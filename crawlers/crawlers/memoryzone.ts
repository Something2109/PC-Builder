import { APIWebsiteInfo, CrawlLink } from "../crawler";
import { SellerProduct } from "@/models/sellers/SellerProduct";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://memoryzone.com.vn";
const mapping: { [key in Products]: string } = {
  [Products.CPU]: "cpu-may-tinh",
  [Products.GPU]: "vga",
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

const CrawlInfo: APIWebsiteInfo<Element, SellerProduct> = {
  domain,

  path(product: Products): CrawlLink | null {
    if (mapping[product]) {
      const url = new URL(`${domain}/${mapping[product]}`);

      return { url };
    }

    return null;
  },

  next(link: CrawlLink): CrawlLink {
    let page = link.url.searchParams.get("page");

    if (!page) {
      page = "1";
    }
    link.url.searchParams.set("page", (Number(page) + 1).toString());

    return link;
  },

  async extract(response: Response) {
    const dom = new JSDOM(await response.text()).window.document;
    const itemContainer = dom.querySelector(".product-list");

    if (itemContainer) {
      const pageList = dom.querySelectorAll(".page-item");
      const total =
        pageList.length == 0
          ? 1
          : pageList.item(pageList.length - 2).textContent;

      const list = [...itemContainer.querySelectorAll(".product-col")];

      return { list, pages: Number(total) };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  async parse(raw) {
    const name = raw.querySelector(".product-name")?.textContent;
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

    return new SellerProduct({ name, price, link, img, availability });
  },
};

export default { info: CrawlInfo, save: "sellers" };
