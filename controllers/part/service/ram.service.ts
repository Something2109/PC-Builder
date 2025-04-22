import { Injectable } from "@nestjs/common";
import Part, { Mapping } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.RAM][number]]: Part.Detail[key];
};

@Injectable()
class RAMService extends BaseDetailPartService<Detail> {
  readonly part = Products.RAM;
}

export { RAMService };
