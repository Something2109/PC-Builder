import { NumberFilterOptions } from "@/utils/interface/utils";
import { Op, WhereOptions } from "sequelize";
import { Model } from "sequelize-typescript";

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
  CASE_RADIATOR_SUPPORT = "case_radiator_support",
  CASE_HARD_DRIVE_SUPPORT = "case_hard_drive_support",
  CASE_PSU_SUPPORT = "case_psu_support",
  COOLER = "cooler",
  AIO = "aio",
  FAN = "fan",
  CPU_BLOCK = "cpu_block",
  CPU_BLOCK_SOCKET = "cpu_block_socket",
  PUMP = "pump",
  RADIATOR = "radiator",
  RETAIL_PRODUCT = "retail_product",
}

enum ModelScopes {
  SUMMARY = "summary",
  FILTER = "filter",
  DETAIL = "detail",
}

type PartDetailTable<T extends Object> = {
  [key in keyof T]: T[key] | null | undefined;
};

const PartDefaultScope = {
  attributes: {
    exclude: ["raw", "createdAt", "updatedAt"],
  },
};

function defaultFilter<
  T extends Model<Attributes, any>,
  Attributes extends {}
>(options?: { [key in keyof Attributes]?: string[] | number[] }) {
  if (!options) return {};

  const where = Object.entries(options).reduce((acc, [key, entries]) => {
    const { success, data } = NumberFilterOptions.safeParse(entries);
    if (success && data) {
      const [min, max] = data.sort((a, b) => a - b);
      acc[key] = { [Op.between]: [min, max] };
    } else {
      acc[key] = entries;
    }
    return acc;
  }, {} as any);

  return where as WhereOptions<T>;
}

export {
  Tables,
  ModelScopes,
  defaultFilter,
  type PartDetailTable,
  PartDefaultScope,
};
