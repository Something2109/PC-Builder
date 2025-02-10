import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import AIO from "@/utils/interface/product/AIO";
import { Infos, Products } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [Infos.AIO]: DetailInfo[Infos.AIO];
};

@Injectable()
class AIOService extends BaseDetailPartService<Detail> {
  readonly part = Products.AIO;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = AIO.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.AIO]>
    >()
      .add("socket", parsedParams["socket"])
      .add("form_factor", parsedParams["form_factor"])
      .add("cpu_plate", parsedParams["cpu_plate"]);

    if (options.build()) result[Infos.AIO] = options.build();

    return result;
  }
}

export { AIOService };
