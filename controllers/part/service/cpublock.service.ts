import { Injectable } from "@nestjs/common";
import { ModelStatic } from "sequelize";
import {
  CPUBlockModel,
  CPUBlockSocketModel,
} from "@/models/parts/tables/CPUBlock";
import { ModelScopes } from "@/models/interface";
import { PartInformation } from "@/models/parts";
import Part, { Mapping } from "@/utils/interface/part";
import CPUBlock from "@/utils/interface/part/product/CPUBlock";
import { Products, Infos } from "@/utils/Enum";
import { APIMapping } from "@/utils/interface/api";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.CPU_BLOCK][number]]: Part.Detail[key];
};
type Filter = Part.Filter & CPUBlock.Filter;

@Injectable()
class CPUBlockService extends BaseDetailPartService<Detail, Filter> {
  readonly part = Products.CPU_BLOCK;

  protected async filterPart(
    options: Part.Filter & APIMapping.PageOptions,
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
