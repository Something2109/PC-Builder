import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import GPU from "@/utils/interface/part/GPU";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.GPU]: GPU.Info;
};

@Injectable()
class GPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.GPU;
}

export { GPUService };
