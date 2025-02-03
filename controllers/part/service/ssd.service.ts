import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import {
  FormFactor,
  InternalConnectors,
  Primitive,
} from "@/utils/interface/utils";
import { Products, Info } from "@/utils/Enum";
import SSD from "@/utils/interface/part/SSD";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.SSD]: SSD.Info;
};

@Injectable()
class SSDService extends BaseDetailPartService<Detail> {
  readonly part = Products.SSD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options = {};
    this.parse(params, SSD.MemoryCell, options, "memory_type");
    this.parse(params, FormFactor.SSD, options, "form_factor");
    this.parse(params, Primitive.Number, options, "capacity");
    this.parse(params, InternalConnectors.Storage.SSD, options, "interface");
    this.parse(params, Primitive.Number, options, "read_speed");
    this.parse(params, Primitive.Number, options, "write_speed");

    if (Object.keys(options).length > 0) result[Products.SSD] = options;

    return result;
  }
}

export { SSDService };
