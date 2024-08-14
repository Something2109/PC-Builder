import fs from "fs";
import path from "path";
import { Crawler } from "./crawler";

const crawlerPath = path.join(__dirname, "crawlers");
const crawlName: string[] = [];

const webs = fs
  .readdirSync(crawlerPath)
  .filter((value) => value.endsWith(".js"));

webs.forEach((file) => {
  if (crawlName.length > 0 && !crawlName.includes(file)) {
    return;
  }
  const crawlerFile = path.join(crawlerPath, file);

  let info = require(crawlerFile).default;
  if (!Crawler.isCrawlInfo(info)) {
    console.log(`The object in ${crawlerPath} is not a crawler`);

    return;
  }
  console.log(`Start fetching data from ${info.domain}`);

  Crawler.add(info);
});

Crawler.crawl();
