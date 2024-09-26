import { Products } from "../Enum";
import AIOType from "./part/AIO";
import CaseType from "./part/Case";
import CoolerType from "./part/Cooler";
import CPUType from "./part/CPU";
import FanType from "./part/Fan";
import GPUType from "./part/GPU";
import GraphicCardType from "./part/GraphicCard";
import HDDType from "./part/HDD";
import MainboardType from "./part/Mainboard";
import PSUType from "./part/PSU";
import RAMType from "./part/RAM";
import SSDType from "./part/SSD";
import { FilterOptionsType } from "./part/utils";

export namespace PartType {
  export type BasicInfo = {
    part: string;
    name: string;
    code_name: string;
    brand: string;
    family?: string;
    series: string;

    launch_date?: Date;
    url?: string;
    image_url?: string;
  };

  const ParticularAttrList = [
    "id",
    "name",
    "code_name",
    "url",
    "image_url",
    "launch_date",
  ] as const;

  export type ParticularAttributes = (typeof ParticularAttrList)[number];

  export type Filterables = Exclude<keyof BasicInfo, ParticularAttributes>;

  export type FilterOptions = FilterOptionsType<BasicInfo, Filterables>;

  export type DetailInfo<T extends Products> = Omit<
    PartType.BasicInfo & { raw: string },
    "id"
  > & {
    [key in T]: DetailInfoList[T];
  };

  type DetailInfoList = {
    [Products.CPU]: CPUType.Info;
    [Products.GPU]: GPUType.Info;
    [Products.GRAPHIC_CARD]: GraphicCardType.Info;
    [Products.MAIN]: MainboardType.Info;
    [Products.RAM]: RAMType.Info;
    [Products.SSD]: SSDType.Info;
    [Products.HDD]: HDDType.Info;
    [Products.PSU]: PSUType.Info;
    [Products.CASE]: CaseType.Info;
    [Products.FAN]: FanType.Info;
    [Products.COOLER]: CoolerType.Info;
    [Products.AIO]: AIOType.Info;
  };
}

export type FilterOptions = PartType.FilterOptions & {
  [Products.CPU]?: CPUType.FilterOptions;
  [Products.GPU]?: GPUType.FilterOptions;
  [Products.GRAPHIC_CARD]?: GraphicCardType.FilterOptions;
  [Products.MAIN]?: MainboardType.FilterOptions;
  [Products.RAM]?: RAMType.FilterOptions;
  [Products.SSD]?: SSDType.FilterOptions;
  [Products.HDD]?: HDDType.FilterOptions;
  [Products.PSU]?: PSUType.FilterOptions;
  [Products.CASE]?: CaseType.FilterOptions;
  [Products.FAN]?: FanType.FilterOptions;
  [Products.COOLER]?: CoolerType.FilterOptions;
  [Products.AIO]?: AIOType.FilterOptions;
};
