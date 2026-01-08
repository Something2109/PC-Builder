import { APIWebsiteInfo } from "../../interface";
import { Products } from "../../../utils/Enum";
import { JSDOM } from "jsdom";

const domain = "https://www.msi.com";
const mapping: { [key in Products]?: string } = {
  [Products.GRAPHIC_CARD]: "vga",
  [Products.MAIN]: "mb",
  [Products.SSD]: "storage",
  [Products.PSU]: "Power-Supply",
  [Products.CASE]: "pcc",
  [Products.AIO]: "Liquid-Cooling",
};

const CrawlInfo: APIWebsiteInfo<Element, any> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/api/v1/product/getProductList`);

      url.searchParams.set("product_line", mapping[product]!);
      url.searchParams.set("page_number", page.toString());
      url.searchParams.set("page_size", "500");

      return { request: { url }, product };
    }

    return null;
  },

  async extract(response, info) {
    const requestUrl = new URL(
      typeof info.request === "string"
        ? info.request
        : (info.request as any).url || info.request
    );

    if (requestUrl.toString().includes("getProductList")) {
      const data = await response.json();

      if (!Array.isArray(data.result.getProductList)) {
        throw new Error(`There's possibly a change in the API of ${domain}`);
      }

      const next = data.result.getProductList.map(
        (raw: { product_line: string; link: string }) => {
          const nextUrl = new URL(
            `${domain}/${raw["product_line"]}/${raw["link"]}/Specification`
          );

          nextUrl.searchParams.set(
            "originalUrl",
            `${domain}/${raw["product_line"]}/${raw["link"]}`
          );

          return {
            request: {
              url: nextUrl,
            },
            product: info.product,
          };
        }
      );

      //   if (link.page == 1) { // Pagination uses page_number in path, but here we just process response?
      //     // We need to return info for next page?
      //     // MSI pagination seems to be managed by `path` calling with `page`.
      //     // We need to return logic for next pages if we want crawl.
      //     // For now just process current page items.
      //   }

      return { raw: [], next };
    }

    const list = [];
    const dom = new JSDOM(await response.text()).window.document;
    let table = dom.getElementById("product");

    if (!table) {
      const urlStr =
        typeof info.request === "string"
          ? info.request
          : (info.request as any).url?.toString() || info.request.toString();
      throw new Error(`Cannot find content table in ${urlStr}`);
    }

    list.push(table);

    return { raw: list, next: [] };
  },

  async parse(raw, info) {
    const result: Record<string, string> = {};
    const url = new URL(
      typeof info.request === "string"
        ? info.request
        : (info.request as any).url || info.request
    );
    if (url.searchParams.has("originalUrl"))
      result["url"] = url.searchParams.get("originalUrl")!;
    const model = raw.querySelector(".text-center h3")?.textContent;
    if (model) {
      result["Model"] = model.trim();
    }

    const imgSrc = raw.querySelector(".img-container img")?.getAttribute("src");
    if (imgSrc) {
      result["img"] = imgSrc;
    }

    let table = raw.querySelector(".table-specifications");
    if (table) {
      raw.querySelectorAll(".row").forEach((row) => {
        const title = row.children[0];
        const content = row.children[1];

        if (title && content && title.textContent && content.textContent) {
          result[title.textContent.trim()] = content.textContent.trim();
        }
      });
    } else {
      table = raw.querySelector(".pdtb");
      if (table) {
        raw.querySelectorAll(".td").forEach((row) => {
          const title = row.removeChild(row.children[0]);
          if (title && title.textContent && row.textContent) {
            result[title.textContent.trim()] = row.textContent.trim();
          }
        });
      } else {
        table = raw.querySelector(".container-fluid");
        if (table) {
          table.querySelectorAll("tr").forEach((row) => {
            const title = row.querySelector("th");
            const content = row.querySelector("td");

            if (title && content && title.textContent && content.textContent) {
              result[title.textContent.trim()] = content.textContent.trim();
            }
          });
        } else {
          throw new Error(`Cannot find table`);
        }
      }
    }

    return result;
  },
};

export default CrawlInfo;
