import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import GPU from "@/utils/interface/part/GPU";
import { Primitive } from "@/utils/interface/utils";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.GPU]: GPU.Info;
};

@Injectable()
class GPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.GPU;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);
    result[Products.GPU] = {};

    const options = result[Products.GPU];
    this.parse(params, Primitive.Number, options, "base_frequency");
    this.parse(params, Primitive.Number, options, "boost_frequency");
    this.parse(params, Primitive.Number, options, "memory_size");
    this.parse(params, Primitive.String, options, "memory_type");
    this.parse(params, Primitive.Number, options, "tdp");

    return result;
  }
}

export { GPUService };
