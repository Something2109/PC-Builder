import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import {
  FormFactor,
  InternalConnectors,
  Primitive,
} from "@/utils/interface/utils";
import RAM from "@/utils/interface/part/RAM";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.RAM]: RAM.Info;
};

@Injectable()
class RAMService extends BaseDetailPartService<Detail> {
  readonly part = Products.RAM;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);
    result[Products.RAM] = {};

    const options = result[Products.RAM];
    this.parse(params, FormFactor.RAM, options, "form_factor");
    this.parse(params, Primitive.Number, options, "capacity");
    this.parse(params, InternalConnectors.RAM, options, "interface");

    return result;
  }
}

export { RAMService };
