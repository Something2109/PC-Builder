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

const BaseModelOptions = {
  freezeTableName: true,
  underscored: true,
};
const PartDefaultScope = {
  attributes: {
    exclude: ["id", "createdAt", "updatedAt"],
  },
};

export { Tables, type PartDetailTable, BaseModelOptions, PartDefaultScope };
