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

  async list(options: Filter & PageOptions & SearchOptions) {
    let { part } = options;

    const FilteredPart = PartInformation.scope([
      ModelScopes.SUMMARY,
      { method: [ModelScopes.FILTER, part] },
    ]);

    const { rows, count } = await this.listFromPart(FilteredPart, options);

    return { total: count, list: rows.map((value) => value.toJSON()) };
  }

  async filter(options: Filter): Promise<Filter> {
    const FilteredPart = PartInformation.scope({
      method: [ModelScopes.FILTER, options.part],
    });

    const result: Filter = {
      part: await this.filterFromModel(
        FilteredPart,
        options.part ?? {},
        Part.FilterAttributes
      ),
    };

    return result;
  }
}

export { PartService };
