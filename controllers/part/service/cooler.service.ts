import { Injectable } from "@nestjs/common";
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
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [key in (typeof Cooler.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class CoolerService extends BaseDetailPartService<Detail> {
  readonly part = Products.COOLER;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = Cooler.Filter.parse(params);
    const cpu_block_options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.CPU_BLOCK]>
    >()
      .add("socket", parsedParams["socket"])
      .add("plate", parsedParams["cpu_plate"]);

    if (cpu_block_options.build())
      result[Infos.CPU_BLOCK] = cpu_block_options.build();

    return result;
  }

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

    return await super.filter({ part, [this.part]: filter });
  }
}

export { CoolerService };
