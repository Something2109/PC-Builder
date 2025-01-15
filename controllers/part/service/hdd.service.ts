import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import {
  FormFactor,
  InternalConnectors,
  Primitive,
} from "@/utils/interface/utils";
import { Products, Info } from "@/utils/Enum";
import HDD from "@/utils/interface/part/HDD";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.HDD]: HDD.Info;
};

@Injectable()
class HDDService extends BaseDetailPartService<Detail> {
  readonly part = Products.HDD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);
    result[Products.HDD] = {};

    const options = result[Products.HDD];
    this.parse(params, FormFactor.HDD, options, "form_factor");
    this.parse(params, Primitive.Number, options, "capacity");
    this.parse(params, InternalConnectors.Storage.HDD, options, "interface");
    this.parse(params, Primitive.Number, options, "read_speed");
    this.parse(params, Primitive.Number, options, "write_speed");
    this.parse(params, Primitive.Number, options, "rotational_speed");

    return result;
  }
}

export { HDDService };
