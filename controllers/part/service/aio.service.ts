import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Info, Products } from "@/utils/Enum";
import AIO from "@/utils/interface/part/AIO";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.AIO]: AIO.Info;
};

@Injectable()
class AIOService extends BaseDetailPartService<Detail> {
  readonly part = Products.AIO;
}

export { AIOService };
