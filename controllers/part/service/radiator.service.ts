import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import Radiator from "@/utils/interface/part/Radiator";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.RADIATOR]: Radiator.Info;
};

@Injectable()
class RadiatorService extends BaseDetailPartService<Detail> {
  readonly part = Products.RADIATOR;
}

export { RadiatorService };
