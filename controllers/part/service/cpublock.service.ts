import { Injectable } from "@nestjs/common";
import { ModelStatic } from "sequelize";
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
import { APIMapping } from "@/utils/interface/api";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof CPUBlock.Primary)[number]]: DetailInfo[key];
};
type Filter = Part.FilterOptions & CPUBlock.Filter;

@Injectable()
class CPUBlockService extends BaseDetailPartService<Detail, Filter> {
  readonly part = Products.CPU_BLOCK;

  protected async filterPart(
    options: FilterOptions & APIMapping.PageOptions,
    attributes?: string[],
    include?: { [key in Infos]?: ModelStatic<any> }
  ) {
    options[Infos.CPU_BLOCK] = options[Infos.CPU_BLOCK] ?? {};
    const filter = options[Infos.CPU_BLOCK] ?? {};

    if (!filter.socket) {
      const CPUBlockPartInclude = {
        model: CPUBlockModel.scope({ method: [ModelScopes.FILTER, filter] }),
        attributes: [],
        include: [
          {
            model: PartInformation.scope({
              method: [ModelScopes.FILTER, options.part],
            }),
            attributes: [],
          },
        ],
      };

      filter.socket = (await this.filterAttribute(
        CPUBlockSocketModel,
        options,
        "socket",
        CPUBlockPartInclude
      )) as string[];
    }

    return await super.filterPart(options, attributes, include);
  }
}

export { CPUBlockService };
