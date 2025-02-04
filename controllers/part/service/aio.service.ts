import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import { Info, Products } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { FormFactor, Material, Primitive } from "@/utils/interface/utils";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.AIO]: DetailInfo[Info.AIO];
};

@Injectable()
class AIOService extends BaseDetailPartService<Detail> {
  readonly part = Products.AIO;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.AIO] = {};
    this.parse(params, Primitive.String, options, "socket");
    this.parse(params, FormFactor.Radiator, options, "form_factor");
    this.parse(params, Material.Metal, options, "cpu_plate");

    if (Object.keys(options).length > 0) result[Info.AIO] = options;

    return result;
  }
}

export { AIOService };
