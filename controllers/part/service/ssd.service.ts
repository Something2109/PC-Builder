import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import SSDProduct from "@/utils/interface/product/SSD";
import { Products } from "@/utils/Enum";
import { DetailInfo } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof SSDProduct.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class SSDService extends BaseDetailPartService<Detail> {
  readonly part = Products.SSD;
}

export { SSDService };
