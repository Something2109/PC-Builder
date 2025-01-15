import { InferAttributes, ModelStatic } from "sequelize";
import { Model, ModelCtor } from "sequelize-typescript";
import { CPUModel } from "./tables/CPU";
import { GPUModel } from "./tables/GPU";
import { GraphicCardModel } from "./tables/GraphicCard";
import { MainboardModel } from "./tables/Mainboard";
import { RAMModel } from "./tables/RAM";
import { SSDModel } from "./tables/SSD";
import { HDDModel } from "./tables/HDD";
import { PSUModel } from "./tables/PSU";
import { CaseModel } from "./tables/Case";
import { CoolerModel } from "./tables/Cooler";
import { AIOModel } from "./tables/AIO";
import { FanModel } from "./tables/Fan";
import { CPUBlockModel } from "./tables/CPUBlock";
import { PumpModel } from "./tables/Pump";
import { RadiatorModel } from "./tables/Radiator";
import { PartInformation } from "./tables/Part";
import { Info, Products } from "@/utils/Enum";
import { DefaultFilterOptions, FilterAttributes } from "@/utils/interface";
import { FilterOptionsType } from "@/utils/interface/utils";

export const InfoModels: { [key in Info]: ModelCtor<Model> } = {
  [Info.CPU]: CPUModel,
  [Info.GPU]: GPUModel,
  [Info.GRAPHIC_CARD]: GraphicCardModel,
  [Info.MAIN]: MainboardModel,
  [Info.RAM]: RAMModel,
  [Info.SSD]: SSDModel,
  [Info.HDD]: HDDModel,
  [Info.PSU]: PSUModel,
  [Info.CASE]: CaseModel,
  [Info.COOLER]: CoolerModel,
  [Info.AIO]: AIOModel,
  [Info.FAN]: FanModel,
  [Info.CPU_BLOCK]: CPUBlockModel,
  [Info.PUMP]: PumpModel,
  [Info.RADIATOR]: RadiatorModel,
};

function genericFilter<T extends Model<any, any>>(
  model: ModelStatic<T>,
  filterables: readonly (keyof InferAttributes<T>)[],
  defaultValue?: FilterOptionsType<T, (typeof filterables)[number]>
) {
  return async (options?: FilterOptionsType<T, keyof InferAttributes<T>>) => {
    options = options ?? {};

    const PartFilter = options
      ? model.scope({ method: ["filter", options] })
      : model;
    const result: FilterOptionsType<T, keyof InferAttributes<T>> = {
      ...(defaultValue ?? {}),
    };

    for (const attr of filterables) {
      if (options[attr] && options[attr].length > 0) {
        result[attr] = options[attr];
        continue;
      }

      result[attr] = (
        await PartFilter.findAll({
          attributes: [attr as string],
          group: attr as string,
          order: [attr as string],
        })
      )
        .map((value: T) => value[attr])
        .filter((value: T[typeof attr] | null) => {
          return value && !(value instanceof Object);
        }) as any[];
    }

    return result;
  };
}

export const Models: { [key in Products]: ModelCtor<Model> } = {
  [Products.CPU]: CPUModel,
  [Products.GPU]: GPUModel,
  [Products.GRAPHIC_CARD]: GraphicCardModel,
  [Products.MAIN]: MainboardModel,
  [Products.RAM]: RAMModel,
  [Products.SSD]: SSDModel,
  [Products.HDD]: HDDModel,
  [Products.PSU]: PSUModel,
  [Products.CASE]: CaseModel,
  [Products.COOLER]: CoolerModel,
  [Products.AIO]: AIOModel,
  [Products.FAN]: FanModel,
  [Products.CPU_BLOCK]: CPUBlockModel,
  [Products.PUMP]: PumpModel,
  [Products.RADIATOR]: RadiatorModel,
};

export const ModelFilters = {
  part: genericFilter(PartInformation, FilterAttributes["part"]),
  [Products.CPU]: genericFilter(CPUModel, FilterAttributes[Products.CPU]),
  [Products.GPU]: genericFilter(GPUModel, FilterAttributes[Products.GPU]),
  [Products.GRAPHIC_CARD]: genericFilter(
    GraphicCardModel,
    FilterAttributes[Products.GRAPHIC_CARD]
  ),
  [Products.MAIN]: genericFilter(
    MainboardModel,
    FilterAttributes[Products.MAIN],
    DefaultFilterOptions[Products.MAIN]
  ),
  [Products.RAM]: genericFilter(
    RAMModel,
    FilterAttributes[Products.RAM],
    DefaultFilterOptions[Products.RAM]
  ),
  [Products.SSD]: genericFilter(
    SSDModel,
    FilterAttributes[Products.SSD],
    DefaultFilterOptions[Products.SSD]
  ),
  [Products.HDD]: genericFilter(
    HDDModel,
    FilterAttributes[Products.HDD],
    DefaultFilterOptions[Products.HDD]
  ),
  [Products.PSU]: genericFilter(
    PSUModel,
    FilterAttributes[Products.PSU],
    DefaultFilterOptions[Products.PSU]
  ),
  [Products.CASE]: genericFilter(
    CaseModel,
    FilterAttributes[Products.CASE],
    DefaultFilterOptions[Products.CASE]
  ),
  [Products.COOLER]: genericFilter(
    CoolerModel,
    FilterAttributes[Products.COOLER],
    DefaultFilterOptions[Products.COOLER]
  ),
  [Products.AIO]: genericFilter(
    AIOModel,
    FilterAttributes[Products.AIO],
    DefaultFilterOptions[Products.AIO]
  ),
  [Products.FAN]: genericFilter(
    FanModel,
    FilterAttributes[Products.FAN],
    DefaultFilterOptions[Products.FAN]
  ),
  [Products.CPU_BLOCK]: genericFilter(
    CPUBlockModel,
    FilterAttributes[Products.CPU_BLOCK],
    DefaultFilterOptions[Products.CPU_BLOCK]
  ),
  [Products.PUMP]: genericFilter(
    PumpModel,
    FilterAttributes[Products.PUMP],
    DefaultFilterOptions[Products.PUMP]
  ),
  [Products.RADIATOR]: genericFilter(
    RadiatorModel,
    FilterAttributes[Products.RADIATOR],
    DefaultFilterOptions[Products.RADIATOR]
  ),
};
