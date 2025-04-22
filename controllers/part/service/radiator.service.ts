import { Injectable } from "@nestjs/common";
import Part, { Mapping } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.RADIATOR][number]]: Part.Detail[key];
};

@Injectable()
class RadiatorService extends BaseDetailPartService<Detail> {
  readonly part = Products.RADIATOR;
}

export { RadiatorService };
