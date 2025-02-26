import { Injectable } from "@nestjs/common";
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
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.COOLER]>
    >()
      .add("socket", parsedParams["socket"])
      .add("cpu_plate", parsedParams["cpu_plate"]);

    if (options.build()) result[Infos.COOLER] = options.build();

    return result;
  }
}

export { CoolerService };
