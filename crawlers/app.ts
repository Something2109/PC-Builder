import path from "path";
import fs from "fs";
import { Crawler } from "./crawler";

const crawlerPath = path.join(__dirname, "crawlers");
const dataPath = path.join(".", "data");
if (!fs.existsSync(dataPath)) {
  fs.mkdirSync(dataPath);
}

const webs = fs
  .readdirSync(crawlerPath)
  .filter((value) => value.endsWith(".js"));

webs.forEach((file) => {
  const crawlerFile = path.join(crawlerPath, file);

  let { info, save } = require(crawlerFile).default;
  if (!Crawler.isCrawlInfo(info)) {
    console.log(`The object in ${crawlerPath} is not a crawler`);

    return;
  }
  console.log(`Start fetching data from ${info.domain}`);

  const saveFolder = path.join(dataPath, save);
  if (!fs.existsSync(saveFolder)) {
    fs.mkdirSync(saveFolder);
  }

  const savePath = path.join(saveFolder, file.substring(0, file.length - 3));
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }

  Crawler.crawl(info).then((data) => {
    Object.entries(data).forEach(([product, list]) => {
      console.log(
        `Fetched ${list.length} products of ${product} from ${info.domain}`
      );
      fs.writeFileSync(
        path.join(savePath, `${product}.json`),
        JSON.stringify(list)
      );
    });
  });
});
