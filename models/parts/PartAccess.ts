import { Model, ModelStatic, Op } from "sequelize";
import { PartInformation } from "@/models/parts/tables/Part";
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
import { PartType } from "@/utils/interface/Parts";
import { Products } from "@/utils/Enum";

class PartAccess {
  models: { [key in Products]: ModelStatic<Model> };

  constructor() {
    this.models = {
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
  }

  async list(options?: PartType.FilterOptions & PageOptions) {
    try {
      let { page, limit, ...rest } = options ?? {};
      page = (page ?? 1) - 1;
      limit = limit ?? Number(process.env.PageSize ?? 50);

      const { rows, count } = await PartInformation.scope({
        method: ["filter", rest],
      }).findAndCountAll({
        limit,
        offset: page * limit,
      });

      return { total: count, list: rows.map((value) => value.toJSON()) };
    } catch (err) {
      console.error(err);
    }

    return { total: 0, list: [] };
  }

  async search(str: string, options?: PartType.FilterOptions & PageOptions) {
    try {
      let { page, limit, ...rest } = options ?? {};
      page = (page ?? 1) - 1;
      limit = limit ?? Number(process.env.PageSize ?? 50);

      const { rows, count } = await PartInformation.scope({
        method: ["filter", rest],
      }).findAndCountAll({
        where: { name: { [Op.like]: `%${str}%` } },
        limit,
        offset: page * limit,
      });

      if (count) {
        return { total: count, list: rows.map((value) => value.toJSON()) };
      }
    } catch (err) {
      console.error(err);
    }

    return { total: 0, list: [] };
  }

  async filter(
    str: string,
    options?: PartType.FilterOptions
  ): Promise<PartType.FilterOptions> {
    const result: PartType.FilterOptions = {};

    try {
      const PartFilter = PartInformation.scope({
        method: ["filter", options],
      });

      for (const filter of ["part", "brand", "series"]) {
        if (options) {
          const filtered = options[filter as PartType.Filterables];
          if (filtered && filtered.length > 0) {
            result[filter as PartType.Filterables] = filtered;
            continue;
          }
        }
        result[filter as PartType.Filterables] = (
          await PartFilter.findAll({
            where: { name: { [Op.like]: `%${str}%` } },
            attributes: [filter],
            group: filter,
          })
        ).map((value) => value[filter as PartType.Filterables]);
      }
    } catch (err) {
      console.error(err);
    }
    return result;
  }

  async get(
    part: Products,
    id: string
  ): Promise<PartType.DetailInfo<typeof part> | null> {
    try {
      const save = await PartInformation.scope("detail").findByPk(id, {
        include: {
          model: this.models[part],
        },
      });

      if (save) {
        return save.toJSON() as unknown as PartType.DetailInfo<typeof part>;
      }
    } catch (err) {
      console.error(err);
    }

    return null;
  }
}

type PageOptions = {
  page?: number;
  limit?: number;
};

export { PartAccess };
