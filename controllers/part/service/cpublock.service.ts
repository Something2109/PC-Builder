import { Injectable } from "@nestjs/common";
import {
  CPUBlockModel,
  CPUBlockSocketModel,
} from "@/models/parts/tables/CPUBlock";
import { ModelScopes } from "@/models/interface";
import { PartInformation } from "@/models/parts/tables/Part";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import Part from "@/utils/interface/info/Parts";
import CPUBlock from "@/utils/interface/product/CPUBlock";
import { Products, Infos } from "@/utils/Enum";
import {
  BaseDetailPartService,
  SearchOptions,
} from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [Infos.CPU_BLOCK]: DetailInfo[Infos.CPU_BLOCK];
};

@Injectable()
class CPUBlockService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU_BLOCK;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = CPUBlock.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.CPU_BLOCK]>
    >()
      .add("socket", parsedParams["socket"])
      .add("plate", parsedParams["plate"]);

    if (options.build()) result[Infos.CPU_BLOCK] = options.build();

    return result;
  }

  async filter(options: FilterOptions & SearchOptions): Promise<FilterOptions> {
    let { part, [Infos.CPU_BLOCK]: filter } = options;
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
