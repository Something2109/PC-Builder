import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import Pump from "@/utils/interface/product/Pump";
import { Products } from "@/utils/Enum";
import { DetailInfo } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Pump.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class PumpService extends BaseDetailPartService<Detail> {
  readonly part = Products.PUMP;
}

export { PumpService };
