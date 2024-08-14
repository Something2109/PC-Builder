import { ArticleType } from "./articles/article";
import { Products } from "./interface";
import fs from "fs";
import { SellerProduct } from "./sellers/SellerProduct";

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
}

interface DatabaseObject {
  path: string;
}

class Articles implements DatabaseObject {
  path: string;

  constructor(path: string) {
    this.path = `${path}/articles`;
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
}

class Seller implements DatabaseObject {
  path: string;

  constructor(path: string) {
    this.path = `${path}/sellers`;
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
