import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import RAM from "@/utils/interface/product/RAM";
import { Products, Infos } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [key in (typeof RAM.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class RAMService extends BaseDetailPartService<Detail> {
  readonly part = Products.RAM;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = RAM.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.RAM]>
    >()
      .add("form_factor", parsedParams["form_factor"])
      .add("capacity", parsedParams["capacity"])
      .add("interface", parsedParams["interface"]);

    if (options.build()) result[Infos.RAM] = options.build();

    return result;
  }
}

export { RAMService };
