import { Injectable } from "@nestjs/common";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import Part from "@/utils/interface/info/Parts";
import Mainboard from "@/utils/interface/product/Mainboard";
import { Products, Info } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [Info.MAIN]: DetailInfo[Info.MAIN];
};

@Injectable()
class MainboardService extends BaseDetailPartService<Detail> {
  readonly part = Products.MAIN;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = Mainboard.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Info.MAIN]>
    >()
      .add("socket", parsedParams["socket"])
      .add("form_factor", parsedParams["form_factor"])
      .add("ram_form_factor", parsedParams["ram_form_factor"])
      .add("ram_interface", parsedParams["ram_interface"]);

    if (options.build()) result[Info.MAIN] = options.build();

    return result;
  }
}

export { MainboardService };
