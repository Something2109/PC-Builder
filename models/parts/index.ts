import { InferAttributes, Model, ModelStatic, WhereOptions } from "sequelize";
import { CPUModel } from "@/models/parts/tables/CPU";
import { GPUModel } from "@/models/parts/tables/GPU";
import { GraphicCardModel } from "@/models/parts/tables/GraphicCard";
import { MainboardModel } from "@/models/parts/tables/Mainboard";
import { RAMModel } from "@/models/parts/tables/RAM";
import { SSDModel } from "@/models/parts/tables/SSD";
import { HDDModel } from "@/models/parts/tables/HDD";
import { PSUModel } from "@/models/parts/tables/PSU";
import { CaseModel } from "@/models/parts/tables/Case";
import { CoolerModel } from "@/models/parts/tables/Cooler";
import { AIOModel } from "@/models/parts/tables/AIO";
import { FanModel } from "@/models/parts/tables/Fan";
import { Products } from "@/utils/Enum";
import { DefaultFilterOptions, FilterAttributes } from "@/utils/interface";
import { FilterOptionsType } from "@/utils/interface/utils";
import { PartInformation } from "./tables/Part";
import { Connection } from "../interface";

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
        .filter((value: T[typeof attr] | null) => value !== null);
    }

    return result;
  };
}

export function IdSubQuery<T extends InferAttributes<any>>(
  name: string,
  options?: WhereOptions<T>
): string {
  return (Connection.getQueryInterface().queryGenerator as any)
    .selectQuery(name, { attributes: ["id"], where: options ?? {} })
    .slice(0, -1);
}

export const Models: { [key in Products]: ModelStatic<any> } = {
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
};
