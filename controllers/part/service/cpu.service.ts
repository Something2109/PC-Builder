import { Injectable } from "@nestjs/common";
import { Products, Infos } from "@/utils/Enum";
import Part from "@/utils/interface/info/Parts";
import CPU from "@/utils/interface/product/CPU";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [key in (typeof CPU.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class CPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = CPU.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.CPU]>
    >()
      .add("socket", parsedParams["socket"])
      .add("total_cores", parsedParams["total_cores"])
      .add("total_threads", parsedParams["total_threads"])
      .add("base_frequency", parsedParams["base_frequency"])
      .add("turbo_frequency", parsedParams["turbo_frequency"])
      .add("L3_cache", parsedParams["L3_cache"])
      .add("tdp", parsedParams["tdp"]);

    if (options.build()) result[Infos.CPU] = options.build();

    return result;
  }
}

export { CPUService };
