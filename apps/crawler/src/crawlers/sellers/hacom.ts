import { Products } from "../../types/Enum";
import { APIWebsiteInfo } from "../../types/interface";
import {
  RetailProductSchema,
  RetailProductType,
} from "../../types/retailer/Product";

const domain = "https://apis-web.hacom.vn";
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
  data: HacomPartDataAPI[];
};

type HacomPartDataAPI = {
  itemName: string;
  unitSellingPrice: number;
  url: string;
  primaryImage: string;
  onhandQuantity: number;
};

const CrawlInfo: APIWebsiteInfo<HacomPartDataAPI, RetailProductType> = {
  domain,

  save: "sellers",

  path(product, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/api-client/api/v1/TblItemV/get-list`);

      const request = {
        url,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isCount: false,
          SearchModel: {
            skip: 0,
            take: 500,
            categoryId: [mapping[product]],
          },
        }),
      };

      return { request, product };
    }

    return null;
  },

  async extract(response, info) {
    const data: HacomJSONResponse = await response.json();

    if (Array.isArray(data.data)) {
      return data.data;
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  async parse(raw) {
    const name = raw.itemName;
    const price = Number(raw.unitSellingPrice);
    const link = `https://hacom.vn/${raw.url}`;
    const img = raw.primaryImage;
    const availability = raw.unitSellingPrice > 0 && raw.onhandQuantity > 0;

    return RetailProductSchema.parse({ name, price, link, img, availability });
  },
};

export default CrawlInfo;
