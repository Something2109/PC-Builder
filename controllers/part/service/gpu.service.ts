import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import GPU from "@/utils/interface/product/GPU";
import { Products } from "@/utils/Enum";
import { DetailInfo } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof GPU.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class GPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.GPU;
}

export { GPUService };
