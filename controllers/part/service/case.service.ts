import { Injectable } from "@nestjs/common";
import Part, { Mapping } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.CASE][number]]: Part.Detail[key];
};

@Injectable()
class CaseService extends BaseDetailPartService<Detail> {
  readonly part = Products.CASE;
}

export { CaseService };
