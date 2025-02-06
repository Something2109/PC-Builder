import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import Radiator from "@/utils/interface/product/Radiator";
import { Products, Info } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [Info.RADIATOR]: DetailInfo[Info.RADIATOR];
};

@Injectable()
class RadiatorService extends BaseDetailPartService<Detail> {
  readonly part = Products.RADIATOR;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = Radiator.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Info.RADIATOR]>
    >()
      .add("form_factor", parsedParams["form_factor"])
      .add("material", parsedParams["material"]);

    if (options.build()) result[Info.RADIATOR] = options.build();

    return result;
  }
}

export { RadiatorService };
