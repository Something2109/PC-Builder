import fs from "node:fs";
import path from "node:path";

import { normalizeDomain } from "@/utils/part/mapper/utils";

import { APIWebsiteInfo } from "../interface";

export class ScraperRegistry {
  private static cache = new Map<string, APIWebsiteInfo<any, any>>();
  private static crawlersDir = path.join(__dirname, "../crawlers");

  static async getScraper(domain: string): Promise<APIWebsiteInfo<any, any>> {
    const key = normalizeDomain(domain);

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const subdirs = ["sellers", "parts"];
    let scraperPath = "";

    for (const dir of subdirs) {
      // Support both ts (dev) and js (production dist) files
      const pTs = path.join(this.crawlersDir, dir, `${key}.ts`);
      const pJs = path.join(this.crawlersDir, dir, `${key}.js`);
      if (fs.existsSync(pTs) || fs.existsSync(pJs)) {
        scraperPath = path.join(this.crawlersDir, dir, `${key}`);
        break;
      }
    }

    if (!scraperPath) {
      throw new Error(
        `Scraper configuration for '${domain}' (key: ${key}) not found in crawlers directory`
      );
    }

    try {
      const module = await import(scraperPath);
      const scraper = module.default || module.scraper;

      if (!scraper) {
        throw new Error(
          `Scraper configuration default export missing in ${key}`
        );
      }

      this.cache.set(key, scraper);
      return scraper;
    } catch (err: any) {
      throw new Error(`Failed to load scraper for '${domain}': ${err.message}`);
    }
  }

  static register(scraper: APIWebsiteInfo<any, any>) {
    const key = normalizeDomain(scraper.domain);
    this.cache.set(key, scraper);
  }
}
