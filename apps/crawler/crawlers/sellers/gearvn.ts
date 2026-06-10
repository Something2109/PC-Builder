import { Products } from "../../../utils/Enum";
import {
  RetailProductSchema,
  RetailProductType,
} from "../../../utils/interface/retailer/Product";
import { APIWebsiteInfo } from "../../interface";

const domain = "https://gearvn.com";
const mapping: { [key in Products]?: string } = {
  [Products.CPU]: "cpu-bo-vi-xu-ly",
  [Products.GRAPHIC_CARD]: "vga-card-man-hinh",
  [Products.MAIN]: "mainboard-bo-mach-chu",
  [Products.RAM]: "ram-pc",
  [Products.SSD]: "ssd-o-cung-the-ran",
  [Products.HDD]: "hdd-o-cung-pc",
  [Products.PSU]: "psu-nguon-may-tinh",
  [Products.CASE]: "case-thung-may-tinh",
  [Products.COOLER]: "tan-nhiet-khi",
  [Products.AIO]: "tan-nhiet-nuoc",
  [Products.FAN]: "fan-rgb-tan-nhiet-pc",
};

type GearvnJSONResponse = {
  products: GearvnPartDataAPI[];
};

type GearvnPartDataAPI = {
  title: string;
  handle: string;
  available: boolean;
  image: {
    src: string;
  };
  variants: [
    {
      price: string;
    }
  ];
};

const CrawlInfo: APIWebsiteInfo<GearvnPartDataAPI, RetailProductType> = {
  domain,

  save: "sellers",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(
        `${domain}/collections/${mapping[product]}/products.json`
      );
      url.searchParams.set("include", "metafields[product]");
      url.searchParams.set("page", page.toString());
      url.searchParams.set("limit", "500");

      return { request: url, product };
    }
    return null;
  },

  async extract(response, info) {
    const data: GearvnJSONResponse = await response.json();

    if (Array.isArray(data.products)) {
      const url = new URL(info.request as string);
      const page = Number(url.searchParams.get("page"));

      return {
        raw: data.products,
        next: data.products.length ? [this.path!(info.product, page + 1)!] : [],
      };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  async parse(raw) {
    const name = raw.title;
    const price = Number(raw.variants[0].price);
    const link = `${domain}/products/${raw.handle}`;
    const img = raw.image.src;
    const availability = raw.available;

    return RetailProductSchema.parse({ name, price, link, img, availability });
  },
};

export default CrawlInfo;
