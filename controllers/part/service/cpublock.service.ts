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
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof CPUBlock.Primary)[number]]: DetailInfo[key];
};
type Filter = Part.FilterOptions & CPUBlock.Filter;

@Injectable()
class CPUBlockService extends BaseDetailPartService<Detail, Filter> {
  readonly part = Products.CPU_BLOCK;

  async filter(options: FilterOptions): Promise<Filter> {
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

      filter.socket = (await this.filterAttribute(
        CPUBlockSocketModel,
        "socket",
        CPUBlockPartInclude
      )) as string[];
    }

    return await super.filter({ part, [this.part]: filter });
  }
}

export { CPUBlockService };
