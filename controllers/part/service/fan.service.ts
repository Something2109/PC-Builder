import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import Fan from "@/utils/interface/part/Fan";
import { FormFactor } from "@/utils/interface/utils";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.FAN]: Fan.Info;
};

@Injectable()
class FanService extends BaseDetailPartService<Detail> {
  readonly part = Products.FAN;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);
    result[Products.FAN] = {};

    const options = result[Products.FAN];
    this.parse(params, FormFactor.Fan, options, "form_factor");
    this.parse(params, Fan.Bearing, options, "bearing");

    return result;
  }
}

export { FanService };
