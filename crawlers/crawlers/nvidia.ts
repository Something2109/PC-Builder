import { APIWebsiteInfo } from "../crawler";
import { Products } from "@/models/interface";
import { JSDOM } from "jsdom";

const domain = "https://www.nvidia.com";
const mapping: { [key in Products]?: string } = {
  [Products.GPU]: "en-us/geforce/graphics-cards/compare",
};

const CrawlInfo: APIWebsiteInfo<HTMLTableElement, any> = {
  domain,

  save: "parts",

  path(product: Products) {
    if (mapping[product]) {
      const url = new URL(`${domain}/${mapping[product]}`);

      return { url, type: "page", page: 1, product };
    }

    return null;
  },

  async extract(link, response) {
    const htmlText = await new Response(response.body).text();

    const document = new JSDOM(htmlText).window.document;
    const tables = document.getElementsByTagName("table");

    return {
      list: [...tables],
      links: [],
      pages: null,
    };
  },

  parse(raw: HTMLTableElement) {
    const result: {
      [key in string]: { [key in string]: string | null };
    } = {};

    const col_num: number = raw.rows[0].cells.length;
    let property_idx = 0;

    for (let i = 0; i < col_num; i++) {
      const header = raw.rows[0].cells[i].textContent;
      if (header) {
        if (header.match(/^ +$/)) {
          property_idx = i;
        } else {
          result[header] = {};
          for (let j = 1; j < raw.rows.length; j++) {
            const property =
              raw.rows[j].cells[property_idx].textContent?.trim();
            const value = raw.rows[j].cells[i];

            if (property && value) {
              result[header][property] = value.textContent?.trim()!;
            }
          }
        }
      }
    }

    return result;
  },
};

export default CrawlInfo;
