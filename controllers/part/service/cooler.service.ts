import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import Cooler from "@/utils/interface/part/Cooler";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.COOLER]: Cooler.Info;
};

@Injectable()
class CoolerService extends BaseDetailPartService<Detail> {
  readonly part = Products.COOLER;
}

export { CoolerService };
