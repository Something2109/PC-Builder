import { Injectable } from "@nestjs/common";
import Part, { Mapping } from "@/utils/interface/part";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.AIO][number]]: Part.Detail[key];
};

@Injectable()
class AIOService extends BaseDetailPartService<Detail> {
  readonly part = Products.AIO;
}

export { AIOService };
