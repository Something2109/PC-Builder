import { Injectable } from "@nestjs/common";
import {
  CPUBlockModel,
  CPUBlockSocketModel,
} from "@/models/parts/tables/CPUBlock";
import { ModelScopes } from "@/models/interface";
import { PartInformation } from "@/models/parts/tables/Part";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import Part from "@/utils/interface/info/Parts";
import { Products, Info } from "@/utils/Enum";
import {
  BaseDetailPartService,
  SearchOptions,
} from "../interface/service.interface";
import { Material, Primitive } from "@/utils/interface/utils";

type Detail = Part.BasicInfo & {
  [Info.CPU_BLOCK]: DetailInfo[Info.CPU_BLOCK];
};

@Injectable()
class CPUBlockService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU_BLOCK;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.CPU_BLOCK] = {};
    this.parse(params, Primitive.String, options, "socket");
    this.parse(params, Material.Metal, options, "plate");

    if (Object.keys(options).length > 0) result[Info.CPU_BLOCK] = options;

    return result;
  }

  async filter(options: FilterOptions & SearchOptions): Promise<FilterOptions> {
    let { part, [Info.CPU_BLOCK]: filter } = options;
    filter = filter ?? {};

    if (!filter.socket) {
      const CPUBlockPartInclude = {
        model: CPUBlockModel.scope({ method: [ModelScopes.FILTER, filter] }),
        attributes: [],
        include: [
          {
            model: PartInformation.scope({
              method: [ModelScopes.FILTER, part],
            }),
            attributes: [],
          },
        ],
      };

      const result = await CPUBlockSocketModel.findAll({
        include: CPUBlockPartInclude,
        attributes: ["socket"],
        group: ["socket"],
        order: ["socket"],
        raw: true,
      });

      filter.socket = result.map((val) => val.socket);
    }

    return await super.filter({ part, [this.part]: filter });
  }
}

export { CPUBlockService };
