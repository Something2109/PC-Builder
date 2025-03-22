import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import { Mapping } from "@/utils/interface/mapping";
import { DetailInfo } from "@/utils/interface";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.FAN][number]]: DetailInfo[key];
};

@Injectable()
class FanService extends BaseDetailPartService<Detail> {
  readonly part = Products.FAN;
}

export { FanService };
