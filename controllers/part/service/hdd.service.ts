import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import HDD from "@/utils/interface/product/HDD";
import { Products } from "@/utils/Enum";
import { DetailInfo } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof HDD.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class HDDService extends BaseDetailPartService<Detail> {
  readonly part = Products.HDD;
}

export { HDDService };
