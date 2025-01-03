import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import Pump from "@/utils/interface/part/Pump";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Products.PUMP]: Pump.Info;
};

@Injectable()
class PumpService extends BaseDetailPartService<Detail> {
  readonly part = Products.PUMP;
}

export { PumpService };
