import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import PSU from "@/utils/interface/part/PSU";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Products.PSU]: PSU.Info;
};

@Injectable()
class PSUService extends BaseDetailPartService<Detail> {
  readonly part = Products.PSU;
}

export { PSUService };
