import { Injectable } from "@nestjs/common";
import { PartInformation } from "@/models/parts/tables/Part";
import {
  CPUBlockModel,
  CPUBlockSocketModel,
} from "@/models/parts/tables/CPUBlock";
import { ModelScopes } from "@/models/interface";
import Part from "@/utils/interface/info/Parts";
import AIO from "@/utils/interface/product/AIO";
import { Infos, Products } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof AIO.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class AIOService extends BaseDetailPartService<Detail> {
  readonly part = Products.AIO;

  async filter(options: FilterOptions): Promise<FilterOptions> {
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

    return await super.filter({ part, [Infos.CPU_BLOCK]: filter });
  }
}

export { AIOService };
