import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import AIO from "@/utils/interface/product/AIO";
import { Info, Products } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [Info.AIO]: DetailInfo[Info.AIO];
};

@Injectable()
class AIOService extends BaseDetailPartService<Detail> {
  readonly part = Products.AIO;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = AIO.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Info.AIO]>
    >()
      .add("socket", parsedParams["socket"])
      .add("form_factor", parsedParams["form_factor"])
      .add("cpu_plate", parsedParams["cpu_plate"]);

    if (options.build()) result[Info.AIO] = options.build();

    return result;
  }
}

export { AIOService };
