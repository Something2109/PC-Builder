import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import Case from "@/utils/interface/part/Case";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Products.CASE]: Case.Info;
};

@Injectable()
class CaseService extends BaseDetailPartService<Detail> {
  readonly part = Products.CASE;
}

export { CaseService };
