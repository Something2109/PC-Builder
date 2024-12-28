enum Tables {
  ARTICLE = "article",
  PART = "part_information",
  CPU = "cpu",
  GPU = "gpu",
  GRAPHIC_CARD = "graphic_card",
  MAIN = "mainboard",
  MAIN_PCIe = "mainboard_pcie",
  MAIN_STORAGE = "mainboard_storage",
  MAIN_USB = "mainboard_usb",
  RAM = "ram",
  SSD = "ssd",
  HDD = "hdd",
  PSU = "psu",
  CASE = "case",
  CASE_MAINBOARD_SUPPORT = "case_mainboard_support",
  CASE_FAN_SUPPORT = "case_fan_support",
  CASE_AIO_SUPPORT = "case_aio_support",
  CASE_HARD_DRIVE_SUPPORT = "case_hard_drive_support",
  CASE_PSU_SUPPORT = "case_psu_support",
  COOLER = "cooler",
  AIO = "aio",
  FAN = "fan",
  RETAIL_PRODUCT = "retail_product",
}

type PartDetailTable<T extends Object> = {
  [key in keyof T]: T[key] | null;
};

const PartDefaultScope = {
  attributes: {
    exclude: ["id", "createdAt", "updatedAt"],
  },
};

export { Tables, type PartDetailTable, PartDefaultScope };
