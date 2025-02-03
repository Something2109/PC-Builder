import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import Radiator from "@/utils/interface/part/Radiator";
import { BaseDetailPartService } from "../interface/service.interface";
import { FormFactor, Material } from "@/utils/interface/utils";

type Detail = Part.BasicInfo & {
  [Info.RADIATOR]: Radiator.Info;
};

@Injectable()
class RadiatorService extends BaseDetailPartService<Detail> {
  readonly part = Products.RADIATOR;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options = {};
    this.parse(params, FormFactor.Radiator, options, "form_factor");
    this.parse(params, Material.Metal, options, "material");

    if (Object.keys(options).length > 0) result[Products.RADIATOR] = options;

    return result;
  }
}

export { RadiatorService };
