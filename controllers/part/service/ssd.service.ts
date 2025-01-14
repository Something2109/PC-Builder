import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import SSD from "@/utils/interface/part/SSD";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.SSD]: SSD.Info;
};

@Injectable()
class SSDService extends BaseDetailPartService<Detail> {
  readonly part = Products.SSD;
}

export { SSDService };
