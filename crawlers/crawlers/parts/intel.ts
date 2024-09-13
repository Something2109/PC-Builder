import { APIWebsiteInfo, CrawlLink } from "../../crawler";
import { Products } from "@/utils/Enum";
import { JSDOM } from "jsdom";

const domain = "https://ark.intel.com";
const mapping: { [key in Products]?: string } = {
  [Products.CPU]: "873",
};

const CrawlInfo: APIWebsiteInfo<Document, any> = {
  domain,

  save: "parts",

  path(product: Products, page = 1) {
    if (mapping[product]) {
      const url = new URL(
        `${domain}/libs/apps/intel/support/ark/advancedFilterSearch`
      );
      url.searchParams.set("productType", mapping[product]);
      url.searchParams.set(
        "forwardPath",
        "/content/www/us/en/ark/search/featurefilter.html"
      );
      url.searchParams.set("pageNo", page.toString());

      return { url, type: "page", page, product };
    }

    return null;
  },

  extract: {
    page: async (link, response) => {
      let links: CrawlLink[] = [];
      let pages;

      const dom = new JSDOM(await response.text()).window.document;

      links = [
        ...dom.querySelectorAll(
          ".ark-product-name.ark-accessible-color.component a"
        ),
      ].map((element) => {
        return {
          url: new URL(`${domain}${element.getAttribute("href")}`),
          type: "product",
          product: link.product,
        };
      });
      if (links.length > 0) {
        pages = link.page + 1;
      }
      return { links, pages };
    },

    product: async (link, response) => {
      const dom = new JSDOM(await response.text()).window.document;
      const list = [];
      const element = dom.querySelector(".specs-blade.specifications");

      if (!element) {
        throw new Error(`Cannot find content table in ${link.url}`);
      }

      list.push({ raw: dom });

      return list;
    },
  },

  parse: function ({ raw, result }) {
    const title = raw.querySelector(".product-family-title-text .h1");

    if (title && title.textContent) {
      result["Model"] = title.textContent;
    }
    raw.querySelectorAll(".specs-blade.specifications").forEach((spec) => {
      spec.querySelectorAll(".blade-inside ul li").forEach((row) => {
        const N = row.querySelector(".label");
        const V = row.querySelector(".value");

        if (N && V && N.textContent && V.textContent) {
          let title = N.textContent.trim();
          title = title
            .replace("\x3c", "\x26lt;")
            .replace("(", "(")
            .replace("^", "^")
            .replace("\x3e", "\x26gt;");
          let content = V.textContent.trim();
          content = content
            .replace("\x3c", "\x26lt;")
            .replace("(", "(")
            .replace("^", "^")
            .replace("\x3e", "\x26gt;");
          result[title] = content.replaceAll(",", " | ");
        }
      });
    });

    return result;
  },
};

export default CrawlInfo;
