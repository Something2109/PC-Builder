import fs from "node:fs";
import path from "node:path";
import { z } from "zod";

import { Name as Products } from "@/utils/part/product";

import { isCrawlInfo } from "./interface";
import { Crawler } from "./lib/crawler";
import { LocalFileStorageAdapter } from "./utils/storage";
import { ProcessWriter } from "./utils/writer";

/** Create an argument object based on the {@link process.argv} list */

let key;
const argumentList: Record<string, string[]> = {};

for (const arg of process.argv) {
  if (/^-{1,2}(\w|\d|-)+/.exec(arg)) {
    key = arg.replace(/-{1,2}/, "");
    argumentList[key] = [];
  } else if (key) {
    argumentList[key].push(arg);
  }
}

/** API path check */

const dirpath = process.cwd();
let filepath = argumentList["path"][0];

if (!filepath) {
  throw new Error("Cannot find path");
}

if (!filepath.endsWith(".js") && !filepath.endsWith(".ts")) {
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

/** Product argument check */

const productList = argumentList["product"]
  ? z.array(z.nativeEnum(Products)).parse(argumentList["product"])
  : Object.values(Products);

/** File path check and output creation */

let output;
let adapter;
if (process.connected) {
  output = new ProcessWriter();
} else if (argumentList["save-path"]?.[0]) {
  let savepath = argumentList["save-path"][0];

  if (!path.isAbsolute(savepath)) {
    savepath = path.join(dirpath, savepath);
  }

  adapter = new LocalFileStorageAdapter(savepath);
}

/** Crawl session */

const crawler = new Crawler(websiteInfo, { output, adapter });

crawler.crawl(productList);
