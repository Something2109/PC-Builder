import { Injectable } from "@nestjs/common";
import { Products } from "@/utils/Enum";
import Part from "@/utils/interface/info/Parts";
import CPU from "@/utils/interface/product/CPU";
import { DetailInfo } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof CPU.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class CPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU;
}

export { CPUService };
