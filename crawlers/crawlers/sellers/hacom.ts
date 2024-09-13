import { APIWebsiteInfo } from "../../crawler";
import { SellerProduct } from "@/models/sellers/SellerProduct";
import { Products } from "@/utils/Enum";

const domain = "https://hacom.vn";
const mapping: { [key in Products]?: string } = {
  [Products.CPU]: "31",
  [Products.GRAPHIC_CARD]: "34",
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

  save: "sellers",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/ajax/get_json.php`);

      url.searchParams.set("action", "product");
      url.searchParams.set("action_type", "product-list");
      url.searchParams.set("page", page.toString());
      url.searchParams.set("show", "500");
      url.searchParams.set("category", mapping[product]);

      return { url, type: "page", page, product };
    }

    return null;
  },

  async extract(link, response) {
    if (link.type != "page") return { list: [], links: [] };

    const data: HacomJSONResponse = await response.json();
    let pages;

    if (link.page == 1) {
      pages = Math.ceil(data.total / data.list.length);
    }

    if (Array.isArray(data.list)) {
      return {
        list: data.list.map((raw) => ({
          raw,
        })),
        links: [],
        pages,
      };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  parse({ raw }) {
    return new SellerProduct({
      name: raw.productName,
      price: Number(raw.price),
      link: `https://hacom.vn${raw.productUrl}`,
      img: raw.productImage.large,
      availability: Number(raw.quantity) !== 0,
    });
  },
};

export default CrawlInfo;
