import { APIWebsiteInfo } from "../crawler";
import { SellerProduct } from "@/models/sellers/SellerProduct";
import { Products } from "@/models/interface";

const domain = "https://hacom.vn";
const mapping: Record<Products, string> = {
  [Products.CPU]: "31",
  [Products.GPU]: "34",
  [Products.MAIN]: "30",
  [Products.RAM]: "32",
  [Products.SSD]: "164",
  [Products.HDD]: "33",
  [Products.PSU]: "36",
  [Products.CASE]: "35",
  [Products.COOLER]: "327",
  [Products.AIO]: "332",
  [Products.FAN]: "68",
};

type HacomJSONResponse = {
  total: number;
  list: HacomPartDataAPI[];
};

type HacomPartDataAPI = {
  productName: string;
  price: string;
  productUrl: string;
  productImage: {
    small: string;
    medium: string;
    large: string;
  };
  quantity: string;
};

const CrawlInfo: APIWebsiteInfo<HacomPartDataAPI, SellerProduct> = {
  domain,

  path(product) {
    if (mapping[product]) {
      const url = new URL(`${domain}/ajax/get_json.php`);

      url.searchParams.set("action", "product");
      url.searchParams.set("action_type", "product-list");
      url.searchParams.set("show", "500");
      url.searchParams.set("category", mapping[product]);

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

  async extract(response: Response) {
    const data: HacomJSONResponse = await response.json();

    if (Array.isArray(data.list)) {
      return {
        list: data.list,
        pages: Math.ceil(data.total / data.list.length),
      };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  async parse(object) {
    return new SellerProduct({
      name: object.productName,
      price: Number(object.price),
      link: `https://hacom.vn${object.productUrl}`,
      img: object.productImage.large,
      availability: Number(object.quantity) !== 0,
    });
  },
};

export default { info: CrawlInfo, save: "sellers" };
