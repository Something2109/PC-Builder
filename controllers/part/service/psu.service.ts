import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { FormFactor, Primitive } from "@/utils/interface/utils";
import { Products, Info } from "@/utils/Enum";
import PSU from "@/utils/interface/part/PSU";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.PSU]: PSU.Info;
};

@Injectable()
class PSUService extends BaseDetailPartService<Detail> {
  readonly part = Products.PSU;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options = {};
    this.parse(params, FormFactor.PSU, options, "form_factor");
    this.parse(params, Primitive.Number, options, "wattage");
    this.parse(params, PSU.Efficiency, options, "efficiency");
    this.parse(params, PSU.Modular, options, "modular");

    if (Object.keys(options).length > 0) result[Products.PSU] = options;

    return result;
  }
}

export { PSUService };
