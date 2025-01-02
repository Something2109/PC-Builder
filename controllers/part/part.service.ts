import { Injectable } from "@nestjs/common";
import { PartInformation } from "@/models/parts/tables/Part";
import { ModelScopes } from "@/models/interface";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/part/Parts";
import {
  BaseDetailPartService,
  BasePartService,
  PageOptions,
  SearchOptions,
} from "./interface/service.interface";
import {
  DetailInfoOptions as Options,
  FilterOptions as Filter,
} from "@/utils/interface";

type ServiceObject = {
  [key in Products]?: BaseDetailPartService<any>;
};

type Detail = Part.BasicInfo;

@Injectable()
class PartService extends BasePartService {
  readonly PartService: ServiceObject;

  constructor(...services: BaseDetailPartService<any>[]) {
    super();
    this.PartService = services.reduce((acc, service) => {
      acc[service.part] = service;
      console.log(service);
      return acc;
    }, {} as ServiceObject);
  }

  async list(options?: Filter & PageOptions & SearchOptions) {
    let { part } = options ?? {};

    const FilteredPart = PartInformation.scope([
      ModelScopes.SUMMARY,
      { method: [ModelScopes.FILTER, part] },
    ]);

    const { rows, count } = await this.listFromPart(
      FilteredPart,
      options ?? {}
    );

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  async filter(options?: Filter): Promise<Filter> {
    const { part } = options ?? {};

    const FilteredPart = PartInformation.scope({
      method: [ModelScopes.FILTER, { ...part, part: [Products.MAIN] }],
    });

    const result: Filter = {
      part: await this.filterFromModel(
        FilteredPart,
        part ?? {},
        Part.FilterAttributes
      ),
    };

    return result;
  }

  async create(data: Options): Promise<Detail | string> {
    const instance = await this.buildPart(data);

    if (typeof instance === "string") return instance;

    await instance.save();

    return (await this.get(instance.id)) as Detail;
  }

  async get(id: string): Promise<Detail | null> {
    const save = await this.getPart(
      PartInformation.scope(ModelScopes.DETAIL),
      id
    );

    if (!save) return null;

    return save.toJSON();
  }

  async set(data: Options, id: string): Promise<Detail | string | null> {
    const instance = await this.setPart(data, id);

    if (!instance || typeof instance === "string") return instance;

    await instance.save();

    return await this.get(instance.id);
  }

  async delete(id: string) {
    const instance = await this.getPart(
      PartInformation.scope(ModelScopes.DETAIL),
      id
    );

    if (!instance) return null;

    await instance.destroy();

    return instance.toJSON();
  }
}

export { PartService };
