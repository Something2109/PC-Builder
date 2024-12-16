import path from "path";
import fs from "fs";
import { Crawler } from "./lib/crawler";
import { z } from "zod";
import { Products } from "../utils/Enum";
import { FileWriter, ProcessWriter } from "./utils/writer";
import { isCrawlInfo } from "./interface";
import { CrawlHandler } from "./utils/handler";

/** Create an argument object based on the {@link process.argv} list */

let key;
const argumentList: Record<string, string[]> = {};

for (const arg of process.argv) {
  if (arg.match(/^-{1,2}(\w|\d|-)+/)) {
    key = arg.replace(/-{1,2}/, "");
  } else if (key) {
    argumentList[key]
      ? argumentList[key].push(arg)
      : (argumentList[key] = [arg]);
  }
}

/** API path check */

const dirpath = process.cwd();
let filepath = argumentList["path"][0];

if (!filepath) {
  throw new Error("Cannot find path");
}

if (!filepath.endsWith(".js")) {
  throw new Error(`Invalid file type: ${path.basename(filepath)}`);
}

if (!path.isAbsolute(filepath)) {
  filepath = path.join(dirpath, filepath);
}

if (!fs.existsSync(filepath)) {
  throw new Error(`Path ${filepath} is not exist.`);
}

const websiteInfo = require(filepath).default;

if (!isCrawlInfo(websiteInfo)) {
  throw new Error(
    `The default object in the path: ${filepath} is not implemented the API the crawler required.`
  );
}

const handler = new CrawlHandler(websiteInfo);

/** File path check and output creation */

let output;
if (process.connected) {
  output = new ProcessWriter();
} else if (argumentList["save-path"] && argumentList["save-path"][0]) {
  let savepath = argumentList["save-path"][0];

  if (!path.isAbsolute(savepath)) {
    savepath = path.join(dirpath, savepath);
  }

  if (!fs.existsSync(savepath)) {
    fs.mkdirSync(savepath, { recursive: true });
  }

  output = new FileWriter({ path: savepath });
}

/** Product argument check */

const productList = argumentList["product"]
  ? z.array(z.nativeEnum(Products)).parse(argumentList["product"])
  : Object.values(Products);

console.log(
  `Start crawling with info in ${filepath} and product in ${productList.join(
    ", "
  )}`
);

/** Crawl session */

const crawler = new Crawler(handler, { output });

crawler.crawl(productList);
