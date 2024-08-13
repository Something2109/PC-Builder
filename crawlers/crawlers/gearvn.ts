import { APIWebsiteInfo, CrawlLink } from "../crawler";
import { SellerProduct } from "@/models/sellers/SellerProduct";
import { Products } from "@/models/interface";

const domain = "https://gearvn.com";
const mapping = {
  [Products.CPU]: "cpu-bo-vi-xu-ly",
  [Products.GPU]: "vga-card-man-hinh",
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

const CrawlInfo: APIWebsiteInfo<GearvnPartDataAPI, SellerProduct> = {
  domain,

  path(product: Products) {
    if (mapping[product]) {
      const url = new URL(
        `${domain}/collections/${mapping[product]}/products.json`
      );
      url.searchParams.set("include", "metafields[product]");
      url.searchParams.set("limit", "500");

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
    const data: GearvnJSONResponse = await response.json();

    if (Array.isArray(data.products)) {
      return { list: data.products, pages: null };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  async parse(object) {
    return new SellerProduct({
      name: object.title,
      price: Number(object.variants[0].price),
      link: `${domain}/products/${object.handle}`,
      img: object.image.src,
      availability: object.available,
    });
  },
};

export default { info: CrawlInfo, save: "sellers" };
