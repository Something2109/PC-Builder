import { APIWebsiteInfo, CrawlLink } from "../crawler";
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

  path(product: Products) {
    if (mapping[product]) {
      const url = new URL(`${domain}/recent-data/apiv2/SeriesFilterResult`);

      url.searchParams.set("SystemCode", "asus");
      url.searchParams.set("WebsiteCode", "global");
      url.searchParams.set("ProductLevel1Code", "motherboards-components");
      url.searchParams.set("ProductLevel2Code", mapping[product]);

      return { url };
    }

    return null;
  },

  async extract(response: Response) {
    const data = await response.json();

    if (data.Result) {
      return {
        list: data.Result.ProductList ?? [],
        pages:
          Math.ceil(data.Result.TotalCount / data.Result.ProductList.length) ??
          null,
      };
    }

    throw new Error(`There's possibly a change in the API of ${domain}`);
  },

  next(link: CrawlLink) {
    return link;
  },

  parse: function (raw: any): Promise<any> {
    return raw;
  },
};

export default { info: CrawlInfo, save: "parts" };
