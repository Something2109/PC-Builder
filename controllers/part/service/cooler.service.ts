import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import { Material, Primitive } from "@/utils/interface/utils";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.COOLER]: DetailInfo[Info.COOLER];
};

@Injectable()
class CoolerService extends BaseDetailPartService<Detail> {
  readonly part = Products.COOLER;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.COOLER] = {};
    this.parse(params, Primitive.String, options, "socket");
    this.parse(params, Material.Metal, options, "cpu_plate");

    if (Object.keys(options).length > 0) result[Info.COOLER] = options;

    return result;
  }
}

export { CoolerService };
