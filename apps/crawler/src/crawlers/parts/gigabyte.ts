import { JSDOM } from "jsdom";

import { Products } from "../../types/Enum";
import { APIWebsiteInfo } from "../../types/interface";

const domain = "https://www.gigabyte.com";
const mapping: { [key in Products]?: string } = {
  [Products.GRAPHIC_CARD]: "3",
  [Products.MAIN]: "2",
  [Products.RAM]: "53",
  [Products.SSD]: "54",
  [Products.PSU]: "41",
  [Products.CASE]: "9",
  [Products.AIO]: "40",
};

const CrawlInfo: APIWebsiteInfo<any, Record<string, string>> = {
  domain,

  save: "parts",

  path(product: Products, page: number = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/Ajax/Product/GetConsumerListPageInfo`);

      const formBody = new FormData();
      formBody.set("ClassKey", mapping[product]);
      formBody.set("PageSize", "500");
      formBody.set("PageNumber", page.toString());

      return {
        request: {
          url,
          method: "POST",
          body: formBody,
        },
        product,
      };
    }

    return null;
  },

  async extract(response, info) {
    const requestUrl = new URL(
      typeof info.request === "string" ? info.request : (info.request as any).url || info.request
    );

    if (requestUrl.pathname.includes("GetConsumerListPageInfo")) {
      const data = await response.text();
      const dom = new JSDOM(data).window.document;

      let next = [...dom.querySelectorAll(".product_list_box")].map((raw) => {
        const productId = raw.querySelector(".WTB_button")!.getAttribute("data-ProductId");
        const nextUrl = new URL(`${domain}/api/ProductSpec/${productId}`);

        const productUrl = `${domain}${raw
          .querySelector(".product_list_box_info_ImageLink")!
          .getAttribute("href")}`;
        const img = `https${raw
          .querySelector(".js-rwdWebp_Item-Image.css-Item-ImagePicture img")!
          .getAttribute("data-src")}`;

        nextUrl.searchParams.set("productUrl", productUrl);
        nextUrl.searchParams.set("img", img);

        return {
          request: {
            url: nextUrl,
          },
          product: info.product, // propagate product type
        };
      });

      return { raw: [], next };
    }

    const list = [];
    const data = await response.json();
    if (!data || !Array.isArray(data.ProductSpecList) || !data.ProductSpecList[0]) {
      throw new Error(`There's possibly a change in the API of ${domain}`);
    }

    list.push({
      raw: data.ProductSpecList[0],
      requestUrl: requestUrl, // pass url for parse to read params
    });

    return { raw: list, next: [] };
  },

  async parse(raw) {
    const result: Record<string, string> = {};
    if (raw.requestUrl) {
      const url = new URL(raw.requestUrl);
      result["url"] = url.searchParams.get("productUrl") || "";
      result["img"] = url.searchParams.get("img") || "";
    }
    const productSpec = raw.raw || raw; // Handle wrapper or direct

    result["Model"] = productSpec["Name"];
    if (productSpec.ProductSpecData) {
      productSpec.ProductSpecData.forEach((row: any) => {
        result[row["Name"]] = row["Description"];
      });
    }

    return result;
  },
};

export default CrawlInfo;
