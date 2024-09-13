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
}

enum Tables {
  ARTICLE = "article",
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

abstract class BasePartTable extends Model {
  declare id: string;
  declare name: string;
  declare code_name: string;
  declare brand: string;
  declare series: string;

  declare launch_date?: Date;
  declare url?: string;
  declare image_url?: string;
}

const BaseInformation = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code_name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  series: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  launch_date: {
    type: DataTypes.DATE,
  },
  url: {
    type: DataTypes.STRING,
  },
  image_url: {
    type: DataTypes.STRING,
  },
};

const BaseModelOptions = {
  sequelize: Connection,
  freezeTableName: true,
  underscored: true,
};

export {
  Topics,
  Products,
  Tables,
  BasePartTable,
  Connection,
  BaseInformation,
  BaseModelOptions,
};
