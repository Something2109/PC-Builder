import { Injectable } from "@nestjs/common";
import Part, { Mapping } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.CPU_BLOCK][number]]: Part.Detail[key];
};

@Injectable()
class CPUBlockService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU_BLOCK;
}

export { CPUBlockService };
