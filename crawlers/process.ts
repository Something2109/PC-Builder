import fs from "fs";
import { Crawler } from "./crawler";

try {
  const filedir = process.argv[2];

  if (!filedir || !fs.existsSync(filedir) || !filedir.endsWith(".js")) {
    throw new Error(`Cannot find path ${filedir}`);
  }

  const info = require(filedir).default;

  if (!Crawler.isCrawlInfo(info)) {
    throw new Error(`The file in ${filedir} is not a crawler`);
  }

  Crawler.add(info);
  Crawler.crawl();
} catch (err) {
  console.log(err);
}
