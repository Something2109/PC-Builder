import { Article, ArticleSummary, ArticleType } from "./articles/article";
import { Connection } from "./interface";
import { SellerProduct } from "./sellers/SellerProduct";
import { Products } from "@/utils/Enum";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
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

  /**
   * @deprecated
   */
  async getIntroduction(product: Products) {
    return this.get("introduction", product);
  }

  /**
   * @deprecated
   */
  async setIntroduction(product: Products, article: ArticleType) {
    return this.set("introduction", product, article);
  }

  async getSummary(criteria: {
    topic: string;
    part?: Products;
  }): Promise<ArticleSummary[]> {
    try {
      const toType = (article: Article) => ({
        url: `/${article.topic}/${article.part}`,
        title: article.title,
        author: article.author,
        standfirst: article.standfirst,
        createdAt: article.createdAt,
      });

      const save = await Article.findAll({ where: criteria });

      return save.map((article) => toType(article));
    } catch (error) {
      console.error(error);
    }
    return [];
  }

  async get(topic: string, part: Products): Promise<ArticleType | null> {
    try {
      const save = await Article.findOne({ where: { topic, part } });

      if (save) {
        return {
          type: "article",
          title: save.title,
          author: save.author,
          standfirst: save.standfirst,
          createdAt: save.createdAt,
          content: save.content,
        };
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async set(topic: string, part: Products, article: ArticleType) {
    try {
      if (Object.values(Products).includes(part)) {
        const { type, ...data } = article;

        let save = await Article.findOne({ where: { topic, part } });

        if (!save) {
          save = Article.build({ topic, part, ...data });
        } else {
          save.set({ ...data });
        }

        await save.save();

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

Connection.sync();

export { MockDatabase as Database };
