import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ImageService {
  path: string;

  constructor() {
    this.path = "";
    const pathArr = ["public", "images", "articles"];

    for (let i = 0; i < pathArr.length; i++) {
      this.path = path.join(this.path, pathArr[i]);
      if (!fs.existsSync(this.path)) {
        fs.mkdirSync(this.path);
      }
    }
  }

  set(image: string, ...save: string[]): string | undefined {
    try {
      let savePath = this.path;

      for (const folder of save) {
        savePath = path.join(savePath, folder);
        if (!fs.existsSync(savePath)) fs.mkdirSync(savePath);
      }

      let [filename, data] = image.split(";base64,");
      filename = `${uuidv4()}.${filename.slice(filename.lastIndexOf("/") + 1)}`;
      savePath = path.join(savePath, filename);

      fs.writeFileSync(savePath, data, { encoding: "base64" });

      return `/images/${save.join("/")}/${filename}`;
    } catch (err) {
      console.error(err);
    }
    return undefined;
  }

  remove(imagePath: string) {
    try {
      fs.rmSync(imagePath);

      return imagePath;
    } catch (err) {
      console.error(err);
    }

    return null;
  }
}
