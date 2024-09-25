import { Article, ArticleSummary, ArticleType } from "./articles/article";
import { PartInformation } from "./parts/Part";
import { Connection } from "./interface";
import { SellerProduct } from "./sellers/SellerProduct";
import { Products, Topics } from "@/utils/Enum";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { Model, ModelStatic, Op } from "sequelize";
import { CPU } from "./parts/CPU";
import { GPU } from "./parts/GPU";
import { GraphicCard } from "./parts/GraphicCard";
import { Mainboard } from "./parts/Mainboard";
import { RAM } from "./parts/RAM";
import { SSD } from "./parts/SSD";
import { HDD } from "./parts/HDD";
import { PSU } from "./parts/PSU";
import { Case } from "./parts/Case";
import { Cooler } from "./parts/Cooler";
import { AIO } from "./parts/AIO";
import { Fan } from "./parts/Fan";
import { PartType } from "@/utils/interface/Parts";

class MockDatabase {
  private static path = "./data";
  private static objects: {
    [key in string]: DatabaseObject;
  } = {};

  static initiate() {
    this.objects.introduction = new Articles(this.path);
    this.objects.sellers = new Seller(this.path);
    this.objects.images = new Images();
    this.objects.part = new PartPick();

    Connection.sync();
  }

  static get articles(): Readonly<Articles> {
    if (!this.objects.introduction) {
      this.initiate();
    }
    return this.objects.introduction as Articles;
  }

  static get sellers(): Readonly<Seller> {
    if (!this.objects.sellers) {
      this.initiate();
    }
    return this.objects.sellers as Seller;
  }

  static get images(): Readonly<Images> {
    if (!this.objects.images) {
      this.initiate();
    }
    return this.objects.images as Images;
  }

  static get parts(): Readonly<PartPick> {
    if (!this.objects.part) {
      this.initiate();
    }
    return this.objects.part as PartPick;
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
    topic: Topics;
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
          ...save.toJSON(),
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

        let [save] = await Article.findOrBuild({ where: { topic, part } });
        save.set({ ...data });

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
    pageSize = pageSize ?? Number(process.env.PageSize ?? 50);
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

class PartPick implements DatabaseObject {
  path: string;
  models: { [key in Products]: ModelStatic<Model> };

  constructor() {
    this.path = path.join("part", "cpu");
    this.models = {
      [Products.CPU]: CPU,
      [Products.GPU]: GPU,
      [Products.GRAPHIC_CARD]: GraphicCard,
      [Products.MAIN]: Mainboard,
      [Products.RAM]: RAM,
      [Products.SSD]: SSD,
      [Products.HDD]: HDD,
      [Products.PSU]: PSU,
      [Products.CASE]: Case,
      [Products.COOLER]: Cooler,
      [Products.AIO]: AIO,
      [Products.FAN]: Fan,
    };
  }

  async list(options?: PartType.FilterOptions & PageOptions) {
    try {
      let { page, limit, ...rest } = options ?? {};
      page = (page ?? 1) - 1;
      limit = limit ?? Number(process.env.PageSize ?? 50);

      const { rows, count } = await PartInformation.scope({
        method: ["filter", rest],
      }).findAndCountAll({
        limit,
        offset: page * limit,
      });

      return { total: count, list: rows.map((value) => value.toJSON()) };
    } catch (err) {
      console.error(err);
    }

    return { total: 0, list: [] };
  }

  async search(str: string, options?: PartType.FilterOptions & PageOptions) {
    try {
      let { page, limit, ...rest } = options ?? {};
      page = (page ?? 1) - 1;
      limit = limit ?? Number(process.env.PageSize ?? 50);

      const { rows, count } = await PartInformation.scope({
        method: ["filter", rest],
      }).findAndCountAll({
        where: { name: { [Op.like]: `%${str}%` } },
        limit,
        offset: page * limit,
      });

      if (count) {
        return { total: count, list: rows.map((value) => value.toJSON()) };
      }
    } catch (err) {
      console.error(err);
    }

    return { total: 0, list: [] };
  }

  async filter(
    str: string,
    options?: PartType.FilterOptions
  ): Promise<PartType.FilterOptions> {
    const result: PartType.FilterOptions = {};

    try {
      const PartFilter = PartInformation.scope({
        method: ["filter", options],
      });

      for (const filter of ["part", "brand", "series"]) {
        if (options) {
          const filtered = options[filter as PartType.Filterables];
          if (filtered && filtered.length > 0) {
            result[filter as PartType.Filterables] = filtered;
            continue;
          }
        }
        result[filter as PartType.Filterables] = (
          await PartFilter.findAll({
            where: { name: { [Op.like]: `%${str}%` } },
            attributes: [filter],
            group: filter,
          })
        ).map((value) => value[filter as PartType.Filterables]);
      }
    } catch (err) {
      console.error(err);
    }
    return result;
  }

  async get(
    part: Products,
    id: string
  ): Promise<PartType.DetailInfo<typeof part> | null> {
    try {
      const save = await PartInformation.scope("detail").findByPk(id, {
        include: {
          model: this.models[part],
        },
      });

      if (save) {
        return save.toJSON() as unknown as PartType.DetailInfo<typeof part>;
      }
    } catch (err) {
      console.error(err);
    }

    return null;
  }
}

type PageOptions = {
  page?: number;
  limit?: number;
};

export { MockDatabase as Database };
