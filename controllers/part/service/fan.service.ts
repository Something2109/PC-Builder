import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import FanProduct from "@/utils/interface/product/Fan";
import { DetailInfo } from "@/utils/interface";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof FanProduct.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class FanService extends BaseDetailPartService<Detail> {
  readonly part = Products.FAN;
}

export { FanService };
