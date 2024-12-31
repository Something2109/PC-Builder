import { Op } from "sequelize";
import { Injectable } from "@nestjs/common";
import { PartInformation } from "@/models/parts/tables/Part";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/part/Parts";
import { BasePartService, PageOptions } from "./interface/service.interface";

type ServiceObject = {
  [key in BasePartService["part"]]?: BasePartService;
};

type Detail = Part.BasicInfo;

type Filter = { part?: Part.FilterOptions };

type Options = Partial<Detail>;

@Injectable()
class PartService extends BasePartService {
  part: "default" = "default";

  readonly PartService: ServiceObject;

  constructor(...services: BasePartService[]) {
    super();
    this.PartService = services.reduce((acc, service) => {
      acc[service.part] = service;
      console.log(service);
      return acc;
    }, {} as ServiceObject);
  }

  async list(options?: Filter & PageOptions) {
    let { page, limit, part, ...detail } = options ?? {};
    page = (page ?? 1) - 1;
    limit = limit ?? Number(process.env.PageSize ?? 50);

    const { rows, count } = await PartInformation.scope([
      "summary",
      { method: ["filter", part] },
    ]).findAndCountAll({
      limit,
      offset: page * limit,
    });

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  async search(str: string, options?: Filter & PageOptions) {
    let { page, limit, part } = options ?? {};
    page = (page ?? 1) - 1;
    limit = limit ?? Number(process.env.PageSize ?? 50);

    const { rows, count } = await PartInformation.scope([
      "summary",
      {
        method: ["filter", part],
      },
    ]).findAndCountAll({
      where: { name: { [Op.like]: `%${str}%` } },
      limit,
      offset: page * limit,
    });

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  async filter(options?: Filter): Promise<Filter> {
    const { part } = options ?? {};

    const FilteredPart = PartInformation.scope({
      method: ["filter", { ...part, part: [Products.MAIN] }],
    });

    const result: Filter = {
      part: await this.getFilterOptions(
        FilteredPart,
        part ?? {},
        Part.FilterAttributes
      ),
    };

    return result;
  }

  async get(id: string): Promise<Detail | null> {
    const save = await PartInformation.scope("detail").findByPk(id);
    if (save) {
      return save.toJSON();
    }

    return null;
  }

  async set(data: Options, id?: string): Promise<Detail> {
    const [save] = await PartInformation.findOrCreate({
      where: { id },
      defaults: data,
    });

    await save.update(data);

    return save.toJSON();
  }

  async delete(id: string) {
    const save = await PartInformation.findByPk(id);

    if (save) {
      await save.destroy();

      return save.toJSON();
    }

    return null;
  }
}

export { PartService };
