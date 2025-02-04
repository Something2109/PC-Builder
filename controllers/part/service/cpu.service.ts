import { Injectable } from "@nestjs/common";
import { Products, Info } from "@/utils/Enum";
import Part from "@/utils/interface/info/Parts";
import { Primitive } from "@/utils/interface/utils";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.CPU]: DetailInfo[Info.CPU];
  [Info.GPU]?: DetailInfo[Info.GPU];
};

@Injectable()
class CPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.CPU] = {};
    this.parse(params, Primitive.String, options, "socket");
    this.parse(params, Primitive.Number, options, "total_cores");
    this.parse(params, Primitive.Number, options, "total_threads");
    this.parse(params, Primitive.Number, options, "base_frequency");
    this.parse(params, Primitive.Number, options, "turbo_frequency");
    this.parse(params, Primitive.Number, options, "L3_cache");
    this.parse(params, Primitive.Number, options, "tdp");

    if (Object.keys(options).length > 0) result[Info.CPU] = options;

    return result;
  }
}

export { CPUService };
