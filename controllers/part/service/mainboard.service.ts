import { Injectable } from "@nestjs/common";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import Part from "@/utils/interface/part/Parts";
import {
  FormFactor,
  InternalConnectors,
  Primitive,
} from "@/utils/interface/utils";
import { Products, Info } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.MAIN]: DetailInfo[Info.MAIN];
};

@Injectable()
class MainboardService extends BaseDetailPartService<Detail> {
  readonly part = Products.MAIN;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.MAIN] = {};
    this.parse(params, Primitive.String, options, "socket");
    this.parse(params, FormFactor.Mainboard, options, "form_factor");
    this.parse(params, FormFactor.RAM, options, "ram_form_factor");
    this.parse(params, InternalConnectors.RAM, options, "ram_interface");

    if (Object.keys(options).length > 0) result[Info.MAIN] = options;

    return result;
  }
}

export { MainboardService };
