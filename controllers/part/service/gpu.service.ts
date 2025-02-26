import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import GPU from "@/utils/interface/product/GPU";
import { Products, Infos } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [key in (typeof GPU.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class GPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.GPU;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = GPU.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.GPU]>
    >()
      .add("base_frequency", parsedParams["base_frequency"])
      .add("boost_frequency", parsedParams["boost_frequency"])
      .add("memory_size", parsedParams["memory_size"])
      .add("memory_type", parsedParams["memory_type"])
      .add("tdp", parsedParams["tdp"]);

    if (options.build()) result[Infos.GPU] = options.build();

    return result;
  }
}

export { GPUService };
