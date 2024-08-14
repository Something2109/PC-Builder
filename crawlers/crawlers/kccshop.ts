import { APIWebsiteInfo } from "../crawler";
import { SellerProduct } from "@/models/sellers/SellerProduct";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://kccshop.vn";
const mapping: { [key in Products]?: string } = {
  [Products.CPU]: "cpu-bo-vi-xu-ly",
  [Products.GPU]: "vga-card-man-hinh",
  [Products.MAIN]: "main-bo-mach-chu",
  [Products.RAM]: "ram-bo-nho-trong",
  [Products.SSD]: "o-cung-the-ran-ssd",
  [Products.HDD]: "o-cung-hdd",
  [Products.PSU]: "psu-nguon-may-tinh",
  [Products.CASE]: "case-vo-may-tinh",
  [Products.COOLER]: "tan-nhiet-khi",
  [Products.AIO]: "all-in-one",
  [Products.FAN]: "tan-nhiet-case",
};

const CrawlInfo: APIWebsiteInfo<Element, SellerProduct> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/${mapping[product]}/`);
      url.searchParams.set("page", page.toString());

      return { url, page, product };
    }

    return null;
  },

  async extract(link, response) {
    const dom = new JSDOM(await response.text()).window.document;
    const itemContainer = dom.getElementById("js-category-holder");

    if (itemContainer) {
      const list = [...dom.querySelectorAll(".p-item")];

      return { list, pages: link.page + 1 };
    }

    if (dom.querySelector(".alert-mess")) return { list: [], pages: null };

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  parse(item) {
    const name = item.querySelector(".p-name")?.textContent;
    const price =
      Number(
        item
          .querySelector(".p-price")
          ?.textContent?.replaceAll(".", "")
          .match(/\d+/)
      ) ?? 0;
    const link = `https://kccshop.vn${item
      .querySelector(".p-img")
      ?.getAttribute("href")}`;
    const img = `https://kccshop.vn${item
      .querySelector(".p-img")
      ?.children[0].getAttribute("src")}`;
    const availability = Boolean(item.querySelector(".color-green"));

    return new SellerProduct({ name, price, link, img, availability });
  },
};

export default CrawlInfo;
