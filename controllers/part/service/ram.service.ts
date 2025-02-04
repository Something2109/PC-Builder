import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import {
  FormFactor,
  InternalConnectors,
  Primitive,
} from "@/utils/interface/utils";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.RAM]: DetailInfo[Info.RAM];
};

@Injectable()
class RAMService extends BaseDetailPartService<Detail> {
  readonly part = Products.RAM;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.RAM] = {};
    this.parse(params, FormFactor.RAM, options, "form_factor");
    this.parse(params, Primitive.Number, options, "capacity");
    this.parse(params, InternalConnectors.RAM, options, "interface");

    if (Object.keys(options).length > 0) result[Info.RAM] = options;

    return result;
  }
}

export { RAMService };
