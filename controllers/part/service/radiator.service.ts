import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import { Products, Info } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FormFactor, Material } from "@/utils/interface/utils";

type Detail = Part.BasicInfo & {
  [Info.RADIATOR]: DetailInfo[Info.RADIATOR];
};

@Injectable()
class RadiatorService extends BaseDetailPartService<Detail> {
  readonly part = Products.RADIATOR;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.RADIATOR] = {};
    this.parse(params, FormFactor.Radiator, options, "form_factor");
    this.parse(params, Material.Metal, options, "material");

    if (Object.keys(options).length > 0) result[Info.RADIATOR] = options;

    return result;
  }
}

export { RadiatorService };
