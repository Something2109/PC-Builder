import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import Radiator from "@/utils/interface/product/Radiator";
import { Products } from "@/utils/Enum";
import { DetailInfo } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Radiator.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class RadiatorService extends BaseDetailPartService<Detail> {
  readonly part = Products.RADIATOR;
}

export { RadiatorService };
