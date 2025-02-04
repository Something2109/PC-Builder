import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import {
  FormFactor,
  InternalConnectors,
  Primitive,
} from "@/utils/interface/utils";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { Products, Info } from "@/utils/Enum";
import SSD from "@/utils/interface/info/SSD";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.SSD]: DetailInfo[Info.SSD];
};

@Injectable()
class SSDService extends BaseDetailPartService<Detail> {
  readonly part = Products.SSD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.SSD] = {};
    this.parse(params, SSD.MemoryCell, options, "memory_type");
    this.parse(params, FormFactor.SSD, options, "form_factor");
    this.parse(params, Primitive.Number, options, "capacity");
    this.parse(params, InternalConnectors.Storage.SSD, options, "interface");
    this.parse(params, Primitive.Number, options, "read_speed");
    this.parse(params, Primitive.Number, options, "write_speed");

    if (Object.keys(options).length > 0) result[Info.SSD] = options;

    return result;
  }
}

export { SSDService };
