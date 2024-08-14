import { APIWebsiteInfo } from "../crawler";
import { Products } from "@/models/interface";

const domain = "https://vn.msi.com";
const mapping: { [key in Products]?: string } = {
  [Products.GPU]: "vga",
  [Products.MAIN]: "mb",
  [Products.SSD]: "storage",
  [Products.PSU]: "Power-Supply",
  [Products.CASE]: "pcc",
  [Products.AIO]: "Liquid-Cooling",
};

const CrawlInfo: APIWebsiteInfo<any, any> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/api/v1/product/getProductList`);

      url.searchParams.set("product_line", mapping[product]!);
      url.searchParams.set("page_number", page.toString());
      url.searchParams.set("page_size", "500");

      return { url, page, product };
    }

    return null;
  },

  async extract(link, response) {
    const data = await response.json();

    if (data.result && Array.isArray(data.result.getProductList)) {
      let pages = null;

      if (link.page == 1) {
        pages =
          Math.ceil(data.result.count / data.result.getProductList.length) ?? 0;
      }

      return {
        list: data.result.getProductList ?? [],
        pages,
      };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  parse: function (raw: any) {
    return raw;
  },
};

export default CrawlInfo;
