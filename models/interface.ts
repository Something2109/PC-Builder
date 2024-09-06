import { DataTypes, Model } from "sequelize";
import { Connection } from "./Database";

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

export { Products, Tables, BasePartTable, BaseInformation, BaseModelOptions };
