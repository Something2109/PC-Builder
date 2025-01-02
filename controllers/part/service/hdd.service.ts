import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import HDD from "@/utils/interface/part/HDD";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Products.HDD]: HDD.Info;
};

@Injectable()
class HDDService extends BaseDetailPartService<Detail> {
  readonly part = Products.HDD;
}

export { HDDService };
