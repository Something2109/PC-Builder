import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import {
  FormFactor,
  InternalConnectors,
  Primitive,
} from "@/utils/interface/utils";
import { Products, Info } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.HDD]: DetailInfo[Info.HDD];
};

@Injectable()
class HDDService extends BaseDetailPartService<Detail> {
  readonly part = Products.HDD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.HDD] = {};
    this.parse(params, FormFactor.HDD, options, "form_factor");
    this.parse(params, Primitive.Number, options, "capacity");
    this.parse(params, InternalConnectors.Storage.HDD, options, "interface");
    this.parse(params, Primitive.Number, options, "read_speed");
    this.parse(params, Primitive.Number, options, "write_speed");
    this.parse(params, Primitive.Number, options, "rotational_speed");

    if (Object.keys(options).length > 0) result[Info.HDD] = options;

    return result;
  }
}

export { HDDService };
