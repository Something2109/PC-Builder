import { APIWebsiteInfo } from "../../crawler";
import { SellerProduct } from "@/models/sellers/SellerProduct";
import { Products } from "@/utils/Enum";
import { JSDOM } from "jsdom";

const domain = "https://www.anphatpc.com.vn";
const mapping: { [key in Products]?: string } = {
  [Products.CPU]: "cpu-bo-vi-xu-ly.html",
  [Products.GRAPHIC_CARD]: "vga-card-man-hinh.html",
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

  save: "sellers",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/${mapping[product]}`);
      url.searchParams.set("page", page.toString());

      return { url, type: "page", page, product };
    }

    return null;
  },

  async extract(link, response) {
    const dom = new JSDOM(await response.text()).window.document;
    const itemContainer = dom.querySelector(".product-list-container");

    if (link.type == "page" && itemContainer) {
      const total = itemContainer
        .getElementsByTagName("b")
        .item(0)
        ?.textContent?.match(/\d+/);
      const list = [...itemContainer.querySelectorAll(".p-item")].map(
        (raw) => ({
          raw,
        })
      );
      let pages;

      if (link.page == 1) {
        pages = Math.ceil(Number(total) / list.length);
      }

      return { list, links: [], pages };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  parse({ raw }) {
    const name = raw.querySelector(".p-name")?.textContent?.trim();
    const price = Number(
      raw
        .querySelector(".p-price")
        ?.textContent?.replaceAll(".", "")
        ?.match(/\d+/)
    );
    const link = `${domain}${raw
      .querySelector(".p-name")
      ?.getAttribute("href")}`;
    const img = raw.querySelector(".fit-img")?.getAttribute("data-src");
    const availability = Boolean(raw.querySelector(".btn-in-stock"));

    return new SellerProduct({ name, price, link, img, availability });
  },
};

export default CrawlInfo;
