import { Injectable } from "@nestjs/common";
import { ModelStatic } from "sequelize";
import { PartInformation } from "@/models/parts";
import {
  CPUBlockModel,
  CPUBlockSocketModel,
} from "@/models/parts/tables/CPUBlock";
import { ModelScopes } from "@/models/interface";
import Part, { Mapping } from "@/utils/interface/part";
import AIO from "@/utils/interface/part/product/AIO";
import { Infos, Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";
import { APIMapping } from "@/utils/interface/api";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Infos.AIO][number]]: Part.Detail[key];
};
type Filter = Part.Filter & AIO.Filter;

@Injectable()
class AIOService extends BaseDetailPartService<Detail, Filter> {
  readonly part = Products.AIO;

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

export { AIOService };
