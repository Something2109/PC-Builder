import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import Fan from "@/utils/interface/part/Fan";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.FAN]: Fan.Info;
};

@Injectable()
class FanService extends BaseDetailPartService<Detail> {
  readonly part = Products.FAN;
}

export { FanService };
