import { APIWebsiteInfo } from "../crawler";
import { SellerProduct } from "@/models/sellers/SellerProduct";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://www.anphatpc.com.vn";
const mapping: Record<Products, string> = {
  [Products.CPU]: "cpu-bo-vi-xu-ly.html",
  [Products.GPU]: "vga-card-man-hinh.html",
  [Products.MAIN]: "bo-mach-chu.html",
  [Products.RAM]: "bo-nho-trong.html",
  [Products.SSD]: "o-cung-ssd_dm1030.html",
  [Products.HDD]: "o-cung-desktop_dm1047.html",
  [Products.PSU]: "nguon-dien-may-tinh-psu.html",
  [Products.CASE]: "vo-may-tinh-case.html",
  [Products.COOLER]: "tan-nhiet-khi-aircooling_dm1392.html",
  [Products.AIO]: "bo-tan-nhiet-nuoc-all-in-one_dm1390.html",
  [Products.FAN]: "quat-tan-nhiet_dm1519.html",
};

const CrawlInfo: APIWebsiteInfo<Element, SellerProduct> = {
  domain,

  path(product) {
    if (mapping[product]) {
      const url = new URL(`${domain}/${mapping[product]}`);

      return { url };
    }

    return null;
  },

  next(link) {
    let page = link.url.searchParams.get("page");

    if (!page) {
      page = "1";
    }
    link.url.searchParams.set("page", (Number(page) + 1).toString());

    return link;
  },

  async extract(response) {
    const dom = new JSDOM(await response.text()).window.document;
    const itemContainer = dom.querySelector(".product-list-container");

    if (itemContainer) {
      const total = itemContainer
        .getElementsByTagName("b")
        .item(0)
        ?.textContent?.match(/\d+/);

      const list = [...itemContainer.querySelectorAll(".p-item")];

      return { list, pages: Math.ceil(Number(total) / list.length) };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  async parse(object) {
    const name = object.querySelector(".p-name")?.textContent?.trim();
    const price = Number(
      object
        .querySelector(".p-price")
        ?.textContent?.replaceAll(".", "")
        ?.match(/\d+/)
    );
    const link = `${domain}${object
      .querySelector(".p-name")
      ?.getAttribute("href")}`;
    const img = object.querySelector(".fit-img")?.getAttribute("data-src");
    const availability = Boolean(object.querySelector(".btn-in-stock"));

    return new SellerProduct({ name, price, link, img, availability });
  },
};

export default { info: CrawlInfo, save: "sellers" };
