import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import Cooler from "@/utils/interface/part/Cooler";
import { Material, Primitive } from "@/utils/interface/utils";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.COOLER]: Cooler.Info;
};

@Injectable()
class CoolerService extends BaseDetailPartService<Detail> {
  readonly part = Products.COOLER;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);
    result[Products.COOLER] = {};

    const options = result[Products.COOLER];
    this.parse(params, Primitive.String, options, "socket");
    this.parse(params, Material.Metal, options, "cpu_plate");

    return result;
  }
}

export { CoolerService };
