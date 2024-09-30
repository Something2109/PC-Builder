import { Products } from "../Enum";
import AIO from "./part/AIO";
import Case from "./part/Case";
import Cooler from "./part/Cooler";
import CPU from "./part/CPU";
import Fan from "./part/Fan";
import GPU from "./part/GPU";
import GraphicCard from "./part/GraphicCard";
import HDD from "./part/HDD";
import Mainboard from "./part/Mainboard";
import Part from "./part/Parts";
import PSU from "./part/PSU";
import RAM from "./part/RAM";
import SSD from "./part/SSD";

export type SummaryInfo<T extends Products> = Part.Summary & {
  [key in T]: SummaryInfoList[T];
};

type SummaryInfoList = {
  [Products.CPU]: CPU.Summary;
  [Products.GPU]: GPU.Summary;
  [Products.GRAPHIC_CARD]: GraphicCard.Summary;
  [Products.MAIN]: Mainboard.Summary;
  [Products.RAM]: RAM.Summary;
  [Products.SSD]: SSD.Summary;
  [Products.HDD]: HDD.Summary;
  [Products.PSU]: PSU.Summary;
  [Products.CASE]: Case.Summary;
  [Products.FAN]: Fan.Summary;
  [Products.COOLER]: Cooler.Summary;
  [Products.AIO]: AIO.Summary;
};

export type DetailInfo<T extends Products> = Omit<
  Part.BasicInfo & { raw?: string },
  "id"
> & {
  [key in T]: DetailInfoList[T];
};

type DetailInfoList = {
  [Products.CPU]: CPU.Info;
  [Products.GPU]: GPU.Info;
  [Products.GRAPHIC_CARD]: GraphicCard.Info;
  [Products.MAIN]: Mainboard.Info;
  [Products.RAM]: RAM.Info;
  [Products.SSD]: SSD.Info;
  [Products.HDD]: HDD.Info;
  [Products.PSU]: PSU.Info;
  [Products.CASE]: Case.Info;
  [Products.FAN]: Fan.Info;
  [Products.COOLER]: Cooler.Info;
  [Products.AIO]: AIO.Info;
};

export type FilterOptions = {
  part?: Part.FilterOptions;
  [Products.CPU]?: CPU.FilterOptions;
  [Products.GPU]?: GPU.FilterOptions;
  [Products.GRAPHIC_CARD]?: GraphicCard.FilterOptions;
  [Products.MAIN]?: Mainboard.FilterOptions;
  [Products.RAM]?: RAM.FilterOptions;
  [Products.SSD]?: SSD.FilterOptions;
  [Products.HDD]?: HDD.FilterOptions;
  [Products.PSU]?: PSU.FilterOptions;
  [Products.CASE]?: Case.FilterOptions;
  [Products.FAN]?: Fan.FilterOptions;
  [Products.COOLER]?: Cooler.FilterOptions;
  [Products.AIO]?: AIO.FilterOptions;
};

export const FilterAttributes = {
  part: Part.FilterAttributes,
  [Products.CPU]: CPU.FilterAttributes,
  [Products.GPU]: GPU.FilterAttributes,
  [Products.GRAPHIC_CARD]: GraphicCard.FilterAttributes,
  [Products.MAIN]: Mainboard.FilterAttributes,
  [Products.RAM]: RAM.FilterAttributes,
  [Products.SSD]: SSD.FilterAttributes,
  [Products.HDD]: HDD.FilterAttributes,
  [Products.PSU]: PSU.FilterAttributes,
  [Products.CASE]: Case.FilterAttributes,
  [Products.FAN]: Fan.FilterAttributes,
  [Products.COOLER]: Cooler.FilterAttributes,
  [Products.AIO]: AIO.FilterAttributes,
};

export const DefaultFilterOptions = {
  [Products.MAIN]: Mainboard.DefaultFilterOptions,
  [Products.RAM]: RAM.DefaultFilterOptions,
  [Products.SSD]: SSD.DefaultFilterOptions,
  [Products.HDD]: HDD.DefaultFilterOptions,
  [Products.PSU]: PSU.DefaultFilterOptions,
  [Products.CASE]: Case.DefaultFilterOptions,
  [Products.COOLER]: Cooler.DefaultFilterOptions,
  [Products.AIO]: AIO.DefaultFilterOptions,
  [Products.FAN]: Fan.DefaultFilterOptions,
};
