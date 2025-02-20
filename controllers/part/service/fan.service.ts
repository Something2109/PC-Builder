import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import FanProduct from "@/utils/interface/product/Fan";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { Products, Infos } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [Infos.FAN]: DetailInfo[Infos.FAN];
};

@Injectable()
class FanService extends BaseDetailPartService<Detail> {
  readonly part = Products.FAN;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = FanProduct.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.FAN]>
    >()
      .add("form_factor", parsedParams["form_factor"])
      .add("bearing", parsedParams["bearing"]);

    if (options.build()) result[Infos.FAN] = options.build();

    return result;
  }
}

export { FanService };
