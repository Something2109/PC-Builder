import { DataTypes, Model, Options, Sequelize } from "sequelize";
import mysql2 from "mysql2";
require("dotenv").config();

enum Topics {
  INTRODUCTION = "introduction",
  GUIDE = "guide",
  FORUM = "forum",
}

enum Products {
  CPU = "cpu",
  GPU = "gpu",
  MAIN = "mainboard",
  RAM = "ram",
  SSD = "ssd",
  HDD = "hdd",
  PSU = "psu",
  CASE = "case",
  COOLER = "cooler",
  AIO = "aio",
  FAN = "fan",
}

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
}

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

const options: Options = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  dialect: "mysql",
};

if (options.dialect === "mysql") {
  options.dialectModule = mysql2;
}

const Connection = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  options
);

const BaseModelOptions = {
  sequelize: Connection,
  freezeTableName: true,
  underscored: true,
};

export { Topics, Products, Tables, Connection, BaseModelOptions };
