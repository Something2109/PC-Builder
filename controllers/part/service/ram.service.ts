import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import RAM from "@/utils/interface/part/RAM";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Products.RAM]: RAM.Info;
};

@Injectable()
class RAMService extends BaseDetailPartService<Detail> {
  readonly part = Products.RAM;
}

export { RAMService };
