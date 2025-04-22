import { Injectable } from "@nestjs/common";
import { Products } from "@/utils/Enum";
import Part, { Mapping } from "@/utils/interface/part";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.CPU][number]]: Part.Detail[key];
};

@Injectable()
class CPUService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU;
}

export { CPUService };
