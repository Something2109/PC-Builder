import { BadRequestException, Injectable } from "@nestjs/common";
import { PartInformation } from "@/models/parts/tables/Part";
import { ModelScopes } from "@/models/interface";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/part/Parts";
import {
  BasePartService,
  PageOptions,
  SearchOptions,
} from "./interface/service.interface";

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

  async get(id: string): Promise<Detail | null> {
    const save = await PartInformation.scope(ModelScopes.DETAIL).findByPk(id);

    if (!save) return null;

    return save.toJSON();
  }

  async set(data: Options, id?: string): Promise<Detail> {
    const [instance, created] = await PartInformation.findOrBuild({
      where: { id },
      defaults: data,
    });

    if (!created) {
      if (data.part && data.part !== instance.part) {
        throw new BadRequestException(
          `Attempting to change part type from ${instance.part} to ${data.part}`
        );
      }

      await instance.update(data);
    }

    return instance.toJSON();
  }

  async delete(id: string) {
    const instance = await PartInformation.findByPk(id);

    if (!instance) return null;

    await instance.destroy();

    return instance.toJSON();
  }
}

export { PartService };
