import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import { DetailInfo } from "@/utils/interface";
import { Products } from "@/utils/Enum";
import PSUProduct from "@/utils/interface/product/PSU";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof PSUProduct.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class PSUService extends BaseDetailPartService<Detail> {
  readonly part = Products.PSU;
}

export { PSUService };
