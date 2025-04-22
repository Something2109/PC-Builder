import { Injectable } from "@nestjs/common";
import Part, { Mapping } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.SSD][number]]: Part.Detail[key];
};

@Injectable()
class SSDService extends BaseDetailPartService<Detail> {
  readonly part = Products.SSD;
}

export { SSDService };
