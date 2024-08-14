import { APIWebsiteInfo } from "../crawler";
import { Products } from "@/models/interface";

const domain = "https://odinapi.asus.com";
const mapping: { [key in Products]?: string } = {
  [Products.GPU]: "graphics-cards",
  [Products.MAIN]: "motherboards",
  [Products.PSU]: "power-supply-units",
  [Products.CASE]: "cases",
  [Products.AIO]: "cooling",
};

const CrawlInfo: APIWebsiteInfo<any, any> = {
  domain,

  save: "parts",

  path(product: Products) {
    if (mapping[product]) {
      const url = new URL(`${domain}/recent-data/apiv2/SeriesFilterResult`);

      url.searchParams.set("SystemCode", "asus");
      url.searchParams.set("WebsiteCode", "global");
      url.searchParams.set("ProductLevel1Code", "motherboards-components");
      url.searchParams.set("ProductLevel2Code", mapping[product]);

      return { url, page: 1, product };
    }

    return null;
  },

  async extract(link, response) {
    const data = await response.json();

    if (data.Result) {
      return {
        list: data.Result.ProductList ?? [],
        pages: null,
      };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  parse: function (raw: any) {
    return raw;
  },
};

export default CrawlInfo;
