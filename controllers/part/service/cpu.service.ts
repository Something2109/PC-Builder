import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import CPU from "@/utils/interface/part/CPU";
import GPU from "@/utils/interface/part/GPU";
import { Primitive } from "@/utils/interface/utils";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.CPU]: CPU.Info;
  [Info.GPU]?: GPU.Info;
};

@Injectable()
class CPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);
    result[Products.CPU] = {};

    const options = result[Products.CPU];
    this.parse(params, Primitive.String, options, "socket");
    this.parse(params, Primitive.Number, options, "total_cores");
    this.parse(params, Primitive.Number, options, "total_threads");
    this.parse(params, Primitive.Number, options, "base_frequency");
    this.parse(params, Primitive.Number, options, "turbo_frequency");
    this.parse(params, Primitive.Number, options, "L3_cache");
    this.parse(params, Primitive.Number, options, "tdp");

    return result;
  }
}

export { CPUService };
