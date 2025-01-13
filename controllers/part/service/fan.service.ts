import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import Fan from "@/utils/interface/part/Fan";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Products.FAN]: Fan.Info;
};

@Injectable()
class FanService extends BaseDetailPartService<Detail> {
  readonly part = Products.FAN;
}

export { FanService };
