import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import { Products, Info } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { Primitive } from "@/utils/interface/utils";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.GPU]: DetailInfo[Info.GPU];
};

@Injectable()
class GPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.GPU;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.GPU] = {};
    this.parse(params, Primitive.Number, options, "base_frequency");
    this.parse(params, Primitive.Number, options, "boost_frequency");
    this.parse(params, Primitive.Number, options, "memory_size");
    this.parse(params, Primitive.String, options, "memory_type");
    this.parse(params, Primitive.Number, options, "tdp");

    if (Object.keys(options).length > 0) result[Info.GPU] = options;

    return result;
  }
}

export { GPUService };
