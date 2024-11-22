import { Sequelize } from "sequelize-typescript";

enum Tables {
  ARTICLE = "article",
  PART = "part_information",
  CPU = "cpu",
  GPU = "gpu",
  GRAPHIC_CARD = "graphic_card",
  MAIN = "mainboard",
  RAM = "ram",
  SSD = "ssd",
  HDD = "hdd",
  PSU = "psu",
  CASE = "case",
  COOLER = "cooler",
  AIO = "aio",
  FAN = "fan",
  RETAIL_PRODUCT = "retail_product",
}

type PartDetailTable<T extends Object> = {
  [key in keyof T]: T[key] | null;
};

if (
  !(
    process.env.DATABASE_NAME &&
    process.env.DATABASE_HOST &&
    process.env.DATABASE_PORT &&
    process.env.DATABASE_USERNAME &&
    process.env.DATABASE_PASSWORD
  )
) {
  throw new Error("Not enough env variables specified");
}

const Connection = new Sequelize({
  database: process.env.DATABASE_NAME,
  dialect: "mysql",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  models: [__dirname + "/**/*.ts"],
});

const BaseModelOptions = {
  sequelize: Connection,
  freezeTableName: true,
  underscored: true,
};
const PartDefaultScope = {
  attributes: {
    exclude: ["id", "createdAt", "updatedAt"],
  },
};

export {
  Tables,
  type PartDetailTable,
  Connection,
  BaseModelOptions,
  PartDefaultScope,
};
