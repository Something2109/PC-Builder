import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import HDD from "@/utils/interface/product/HDD";
import { Products, Infos } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [key in (typeof HDD.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class HDDService extends BaseDetailPartService<Detail> {
  readonly part = Products.HDD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = HDD.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.HDD]>
    >()
      .add("form_factor", parsedParams["form_factor"])
      .add("capacity", parsedParams["capacity"])
      .add("interface", parsedParams["interface"])
      .add("read_speed", parsedParams["read_speed"])
      .add("write_speed", parsedParams["write_speed"])
      .add("rotational_speed", parsedParams["rotational_speed"]);

    if (options.build()) result[Infos.HDD] = options.build();

    return result;
  }
}

export { HDDService };
