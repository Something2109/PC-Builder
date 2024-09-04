import { ArticleType } from "./articles/article";
import { Products } from "./interface";
import fs from "fs";
import { SellerProduct } from "./sellers/SellerProduct";
import path from "path";

class MockDatabase {
  private static path = "./data";
  private static objects: {
    [key in string]: DatabaseObject;
  } = {};

  static get articles(): Readonly<Articles> {
    if (!this.objects.introduction) {
      this.objects.introduction = new Articles(this.path);
    }
    return this.objects.introduction as Articles;
  }

  static get sellers(): Readonly<Seller> {
    if (!this.objects.sellers) {
      this.objects.sellers = new Seller(this.path);
    }
    return this.objects.sellers as Seller;
  }

  static get images(): Readonly<Images> {
    if (!this.objects.images) {
      this.objects.images = new Images();
    }
    return this.objects.images as Images;
  }
}

interface DatabaseObject {
  path: string;
}

class Articles implements DatabaseObject {
  path: string;

  constructor(root: string) {
    this.path = path.join(root, "articles");
  }

  getIntroduction(product: Products) {
    try {
      if (Object.values(Products).includes(product)) {
        const data = fs
          .readFileSync(`${this.path}/introduction/${product}.json`)
          .toString();

        return JSON.parse(data) as ArticleType;
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  setIntroduction(product: Products, article: ArticleType) {
    try {
      if (Object.values(Products).includes(product)) {
        fs.writeFileSync(
          `${this.path}/introduction/${product}.json`,
          JSON.stringify(article)
        );
        return article;
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}

class Images implements DatabaseObject {
  path: string;

  constructor() {
    this.path = path.join("public", "images");
  }

  set(image: string, ...save: string[]): string | undefined {
    try {
      let savePath = this.path;

      for (const folder of save) {
        savePath = path.join(savePath, folder);
        if (!fs.existsSync(savePath)) fs.mkdirSync(savePath);
      }

      let [filename, data] = image.split(";base64,");
      filename = `${new Date().getTime()}.${filename.slice(
        filename.lastIndexOf("/") + 1
      )}`;
      savePath = path.join(savePath, filename);

      fs.writeFileSync(savePath, data, { encoding: "base64" });

      return `/images/${save.join("/")}/${filename}`;
    } catch (err) {
      console.error(err);
    }
    return undefined;
  }

  remove(...save: string[]) {
    let savePath = this.path;

    for (const folder of save) {
      savePath = path.join(savePath, folder);
      if (!fs.existsSync(savePath)) fs.mkdirSync(savePath);
    }

    fs.readdirSync(savePath).forEach((filename) => {
      fs.rmSync(path.join(savePath, filename));
    });
  }
}

class Seller implements DatabaseObject {
  path: string;

  constructor(root: string) {
    this.path = path.join(root, "sellers");
  }

  getProducts(
    product: Products,
    page?: number,
    pageSize?: number
  ): {
    list: SellerProduct[];
    pages: number;
  } {
    page = page ?? 1;
    pageSize = pageSize ?? 50;
    try {
      if (Object.values(Products).includes(product)) {
        const data = JSON.parse(
          fs
            .readFileSync(`${this.path}/gearvn/${product}.json`)
            .toString("utf-8")
        );

        if (Array.isArray(data)) {
          return {
            list: data.slice((page - 1) * pageSize, page * pageSize),
            pages: Math.ceil(data.length / pageSize),
          };
        }
      }
    } catch (error) {
      console.error(error);
    }
    return {
      list: [],
      pages: 0,
    };
  }
}

export { MockDatabase as Database };
