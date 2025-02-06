import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { Products, Info } from "@/utils/Enum";
import PSUProduct from "@/utils/interface/product/PSU";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [Info.PSU]: DetailInfo[Info.PSU];
};

@Injectable()
class PSUService extends BaseDetailPartService<Detail> {
  readonly part = Products.PSU;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = PSUProduct.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Info.PSU]>
    >()
      .add("form_factor", parsedParams["form_factor"])
      .add("wattage", parsedParams["wattage"])
      .add("efficiency", parsedParams["efficiency"])
      .add("modular", parsedParams["modular"]);

    if (options.build()) result[Info.PSU] = options.build();

    return result;
  }
}

export { PSUService };
