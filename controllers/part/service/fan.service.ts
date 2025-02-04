import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { Products, Info } from "@/utils/Enum";
import Fan from "@/utils/interface/part/Fan";
import { FormFactor } from "@/utils/interface/utils";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.FAN]: DetailInfo[Info.FAN];
};

@Injectable()
class FanService extends BaseDetailPartService<Detail> {
  readonly part = Products.FAN;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.FAN] = {};
    this.parse(params, FormFactor.Fan, options, "form_factor");
    this.parse(params, Fan.Bearing, options, "bearing");

    if (Object.keys(options).length > 0) result[Info.FAN] = options;

    return result;
  }
}

export { FanService };
