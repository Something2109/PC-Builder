import fs from "fs";
import path from "path";
import { exec, fork, spawn } from "child_process";

const crawlerPath = path.join(__dirname, "crawlers");
const processPath = path.join(__dirname, "process.js");
const crawlName: string[] = ["anphat.js", "hacom.js"];

const folders = [crawlerPath];

while (folders.length > 0) {
  const directory = folders.shift();

  if (directory) {
    const root = fs.readdirSync(directory);

    root.forEach((filename) => {
      const filedir = path.join(directory, filename);

      if (filename.endsWith(".js")) {
        if (crawlName.length > 0 && !crawlName.includes(filename)) {
          return;
        }
        const child = spawn(`node`, [processPath, filedir], {
          stdio: [process.stdin, process.stdout, process.stderr],
        });

        child.on("exit", () =>
          console.log(`Finished crawling from ${filedir}`)
        );
      } else if (fs.lstatSync(filedir).isDirectory()) {
        folders.push(filedir);
      }
    });
  }
}
