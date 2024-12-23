import fs from "fs";
import path from "path";
import { Injectable } from "@nestjs/common";
import { Products } from "@/utils/Enum";
import { CrawlerChildProcess } from "crawlers/lib/process";

@Injectable()
class CrawlerService {
  private crawlers: Record<string, CrawlerChildProcess>;

  constructor() {
    let directoryPath = "./dist/crawlers/crawlers";

    if (!path.isAbsolute(directoryPath)) {
      directoryPath = path.join(process.cwd(), directoryPath);
    }

    if (!fs.existsSync(directoryPath)) {
      throw new Error("The crawler path is not exist.");
    }

    this.crawlers = {};

    this.readFolder(directoryPath);
  }

  start(name: string, products?: Products[]) {
    if (!this.crawlers[name]) {
      throw new Error(`No crawler found with the name ${name}.`);
    }

    if (!products) {
      products = Object.values(Products);
    }

    return this.crawlers[name].start({ products });
  }

  status(name: string) {
    if (!this.crawlers[name]) {
      throw new Error(`No crawler found with the name ${name}.`);
    }

    return this.crawlers[name].status();
  }

  statusAll() {
    return Object.entries(this.crawlers).map(([name, crawler]) => ({
      name,
      status: crawler.status(),
    }));
  }

  stop(name: string) {
    if (!this.crawlers[name]) {
      throw new Error(`No crawler found with the name ${name}.`);
    }

    return this.crawlers[name].stop();
  }

  readFolder(dir: string) {
    const content = fs.readdirSync(dir);

    content.forEach((filename) => {
      const filepath = path.join(dir, filename);
      if (fs.lstatSync(filepath).isDirectory()) {
        this.readFolder(filepath);
        return;
      }

      if (!filename.endsWith(".js")) {
        return;
      }

      try {
        this.crawlers[filename.replace(".js", "")] = new CrawlerChildProcess(
          filepath
        );
      } catch (err) {
        console.error(err);
        console.error(`While importing ${filepath} to the child process.`);
      }
    });
  }
}

export { CrawlerService };
