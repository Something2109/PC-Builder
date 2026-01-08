import { APIWebsiteInfo } from "../../interface";
import { Products } from "../../../utils/Enum";
import { JSDOM } from "jsdom";

const domain = "https://www.lexar.com";
const mapping: { [key in Products]?: string } = {
  [Products.RAM]: "memory-en-gb",
  [Products.SSD]: "ssd-en-gb",
};

const CrawlInfo: APIWebsiteInfo<Element[], Record<string, string>[]> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(
        `${domain}/product-category/${mapping[product]}/page/${page}`
      );

      return { request: { url }, product };
    }

    return null;
  },

  async extract(response, info) {
    const dom = new JSDOM(await response.text()).window.document;

    const requestUrl = new URL(
      typeof info.request === "string"
        ? info.request
        : (info.request as any).url || info.request
    );

    if (requestUrl.toString().includes("product-category")) {
      const next = [...dom.querySelectorAll(".product.type-product")].map(
        (element) => {
          const url = new URL(
            element.querySelector("a")!.getAttribute("href")!
          );

          url.searchParams.set("originalUrl", url.toString());
          const img = element.querySelector("img")?.getAttribute("src");
          if (img) url.searchParams.set("img", img);

          return {
            request: { url },
            product: info.product,
          };
        }
      );

      return { raw: [], next };
    }

    const list = [];

    const model = dom.querySelector(".product_title")?.textContent;
    const raw = [...dom.querySelectorAll(".product-table")];

    if (raw.length == 0 || !model) {
      const urlStr =
        typeof info.request === "string"
          ? info.request
          : (info.request as any).url?.toString() || info.request.toString();
      throw new Error(`Cannot find content table in ${urlStr}`);
    }

    list.push(raw);

    return { raw: list, next: [] };
  },

  async parse(raw, info) {
    const result: Record<string, string>[] = [];
    // Wait, result is passed from previous stage?
    // In old code, `lexar` path was `result: [...]`.
    // We are now passing metadata in URL.
    // We need to inject this metadata into the parsed result?
    // Lexar `APIWebsiteInfo` is `Record<string, string>[]` (array of maps).
    // `raw` here is `Element[]` (list of tables).
    // Existing code: pushes to `result`.
    // `result` was initialized to `info.result ?? []`.
    // Does `info.result` exist? No.
    // So `result` is empty array initially.

    // We need to fetch metadata from URL.
    const url = new URL(
      typeof info.request === "string"
        ? info.request
        : (info.request as any).url || info.request
    );

    // But parse logic populates `data` map inside `result`.
    // Where is the metadata used?
    // Existing code does NOT seem to use `info.result` inside the map loop?
    // It creates `const data: Record<string, string> = {};`.
    // It loops rows and adds to `data`.
    // It returns `result` which contains these `data` objects.
    // WAIT. `lexar.ts` existing `extract.page` supplied `result: [{url, img}]`.
    // And `parse` initialized `result = info.result ?? []`.
    // So `result` started with one item containing `{url, img}`?
    // And then `result.push(...raw.map(...))` appended MORE items?
    // So valid output was `[{url, img}, {spec1...}, {spec2...}]`?
    // Or did `CrawlInfo` merge results? No.
    // If `result` started as `[{url, img}]`, then `push` adds to it.
    // So final array is `[{url, img}, {spec_table_1}, {spec_table_2}]`.
    // This seems to be the intended final data structure for Lexar.

    // So I need to recreate this initial array from URL params.
    if (url.searchParams.has("originalUrl")) {
      const meta: Record<string, string> = {};
      meta["url"] = url.searchParams.get("originalUrl")!;
      if (url.searchParams.has("img"))
        meta["img"] = url.searchParams.get("img")!;
      result.push(meta);
    }

    result.push(
      ...raw.map((table) => {
        const data: Record<string, string> = {};
        const rows = table.querySelectorAll(
          ".wpb_text_column.wpb_content_element"
        );

        for (let i = 0; i < rows.length; i += 2) {
          const title = rows.item(i).textContent;
          const content = rows.item(i + 1).innerHTML;

          if (title && content) {
            data[title] = content;
          }
        }

        return data;
      })
    );

    return result;
  },
};

export default CrawlInfo;
