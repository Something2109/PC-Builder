import { APIWebsiteInfo } from "../../interface";
import { Products } from "../../../utils/Enum";
import { JSDOM } from "jsdom";

const domain = "https://www.gskill.com";
const mapping: { [key in Products]?: string } = {
  [Products.RAM]: "165",
  [Products.SSD]: "9",
  [Products.PSU]: "90",
  [Products.CASE]: "365",
  [Products.AIO]: "353",
};

const CrawlInfo: APIWebsiteInfo<Element, Record<string, string>> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(`${domain}/ajax.php`);

      const formBody = new FormData();
      formBody.set("Func", "firstGetProduct");
      formBody.set("Val", `${mapping[product]}|||${page}`);

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

  async extract(info, response) {
    const requestUrl = new URL(
      typeof info.request === "string"
        ? info.request
        : (info.request as any).url || info.request
    );
    if (requestUrl.toString().includes("ajax.php")) {
      const data = await response.json();

      const html = new JSDOM(data["html"]).window.document;
      const next = [...html.querySelectorAll(".list")].map((raw) => {
        const url = `${domain}${raw
          .querySelector(".item")!
          .getAttribute("href")}`;

        const nextUrl = new URL(
          `${url.replace("product", "specification")}-Specification`
        );
        nextUrl.searchParams.set("originalUrl", url);
        const img = raw.querySelector(".block-img img")?.getAttribute("src");
        if (img) nextUrl.searchParams.set("img", `${domain}${img}`);

        return {
          request: {
            url: nextUrl,
          },
          product: info.product,
        };
      });

      // Pagination logic not needed as logic doesn't recurse?
      // Old code calculated pages but didn't return recursive links for pages.
      // gskill uses POST with page param.
      // If we want to crawl next page, we must return next request.
      // But `raw` here is empty (just links).
      // We need to implement pagination if we want to crawl all pages.
      // Current implementation only crawls based on input page?
      // "pages" return in old code was useless if Crawler didn't use it to loop.
      // Assuming we just process what is requested.

      return { raw: [], next };
    }

    const dom = new JSDOM(await response.text()).window.document;

    const table = dom.querySelector(".list-inner");
    if (!table) {
      const urlStr =
        typeof info.request === "string"
          ? info.request
          : (info.request as any).url?.toString() || info.request.toString();
      throw new Error(`Cannot find content table in ${urlStr}`);
    }

    // result prop was from link.result. We use info.request.url params.
    // We pass info to parse, so parse handles it.

    return { raw: [table], next: [] };
  },

  async parse(raw, info) {
    const result: Record<string, string> = {};
    // Extract result from info.requestSearchParams?
    // We need to access DOM for Code Name/Model again if we didn't pass it.
    // In old product() extract, it modified result directly!
    // "const result = link.result ... result['Code Name'] = ..."
    // So "raw" passed to parse was just "table", but "result" accumulated data from extraction stage.
    // This is TRICKY. The Extract stage modified the Final object?
    // The "Raw" object in Crawler is just what `extract` returns.
    // I should extract Code Name and Model in `parse` instead of `extract`.
    // I have access to full page in `extract`, but distinct logic.
    // `raw` here is just `table`. I lost access to "title" and "sub-title" which are outside table?
    // YES. `dom.querySelector('.title')`.
    // So current `extract` returns ONLY table.
    // If I want title/model, I should include them in `Raw` object or extract them in `extract` and put in `Raw`.
    // `Raw` for gskill is `Element`.
    // I can stick them into Element properties (dirty) or change Raw to be an object `{ table, title, model }`.
    // But `Raw` type is `Element` in interface definition `APIWebsiteInfo<Element,...>`.
    // I can change Ref to `APIWebsiteInfo<{ table: Element, title: string, model: string }, ...>`?
    // Or just parse them in `parse` if `raw` allows access to parent?
    // `table` is Element. `table.ownerDocument` gives access to full DOM?
    // `jsdom` Elements have reference to document? Yes usually.
    // So `raw.ownerDocument.querySelector(...)` should work!

    // Also metadata (img, url) from URL params.
    const url = new URL(
      typeof info.request === "string"
        ? info.request
        : (info.request as any).url || info.request
    );
    if (url.searchParams.has("img"))
      result["img"] = url.searchParams.get("img")!;
    if (url.searchParams.has("originalUrl"))
      result["url"] = url.searchParams.get("originalUrl")!;

    // Recover Model / Code Name from document if possible, or just accept they are lost if I don't change Raw.
    // The old code extracted them in `product` (Extract stage).
    // I should restore that logic in `parse` if I can access the document.
    const doc = raw.ownerDocument;
    if (doc) {
      const code_name = doc.querySelector(".title");
      if (code_name) result["Code Name"] = code_name.innerHTML;
      const model = doc.querySelector(".sub-title");
      if (model && model.innerHTML) {
        result["Model"] = model.innerHTML.slice(
          0,
          model.innerHTML.indexOf("<br>")
        );
      }
    }

    raw.querySelectorAll(".list-descr").forEach((row) => {
      const [title, content] = row.querySelectorAll(".list-block");
      if (title && content && title.textContent && content.textContent) {
        result[title.textContent] = content.textContent;
      }
    });

    return result;
  },
};

export default CrawlInfo;
