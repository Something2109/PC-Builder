import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import CPU from "@/utils/interface/part/CPU";
import GPU from "@/utils/interface/part/GPU";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Products.CPU]: CPU.Info;
  [Products.GPU]?: GPU.Info;
};

@Injectable()
class CPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU;
}

export { CPUService };
