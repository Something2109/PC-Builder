import { Injectable } from "@nestjs/common";
import { ModelStatic } from "sequelize";
import { PartInformation } from "@/models/parts/tables/Part";
import {
  CPUBlockModel,
  CPUBlockSocketModel,
} from "@/models/parts/tables/CPUBlock";
import { ModelScopes } from "@/models/interface";
import Part from "@/utils/interface/info/Parts";
import Cooler from "@/utils/interface/product/Cooler";
import { Products, Infos } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Cooler.Primary)[number]]: DetailInfo[key];
};
type Filter = Part.FilterOptions & Cooler.Filter;

@Injectable()
class CoolerService extends BaseDetailPartService<Detail, Filter> {
  readonly part = Products.COOLER;

  protected async filterPart(
    options: FilterOptions,
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
        "socket",
        CPUBlockPartInclude
      )) as string[];
    }

    return await super.filterPart(options, attributes, include);
  }
}

export { CoolerService };
