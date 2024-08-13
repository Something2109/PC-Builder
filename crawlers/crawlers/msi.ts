import { APIWebsiteInfo, CrawlLink } from "../crawler";
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

  path(product: Products) {
    if (mapping[product]) {
      const url = new URL(`${domain}/api/v1/product/getProductList`);

      url.searchParams.set("product_line", mapping[product]!);
      url.searchParams.set("page_size", "500");

      return { url };
    }

    return null;
  },

  next(link: CrawlLink): CrawlLink {
    let page = link.url.searchParams.get("page_number");

    if (!page) {
      page = "1";
    }
    link.url.searchParams.set("page_number", (Number(page) + 1).toString());

    return link;
  },

  async extract(response: Response) {
    const data = await response.json();

    if (data.result && Array.isArray(data.result.getProductList)) {
      return {
        list: data.result.getProductList ?? [],
        pages:
          Math.ceil(data.result.count / data.result.getProductList.length) ??
          null,
      };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  parse: function (raw: any): Promise<any> {
    return raw;
  },
};

export default { info: CrawlInfo, save: "parts" };
