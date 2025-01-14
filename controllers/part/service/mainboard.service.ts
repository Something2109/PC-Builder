import { Injectable } from "@nestjs/common";
import Mainboard from "@/utils/interface/part/Mainboard";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.MAIN]: Mainboard.Info;
};

@Injectable()
class MainboardService extends BaseDetailPartService<Detail> {
  readonly part = Products.MAIN;
}

export { MainboardService };
