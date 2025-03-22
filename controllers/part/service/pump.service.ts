import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import { Mapping } from "@/utils/interface/mapping";
import { Products } from "@/utils/Enum";
import { DetailInfo } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.PUMP][number]]: DetailInfo[key];
};

@Injectable()
class PumpService extends BaseDetailPartService<Detail> {
  readonly part = Products.PUMP;
}

export { PumpService };
