import { Injectable } from "@nestjs/common";
import { DetailInfo } from "@/utils/interface";
import Part from "@/utils/interface/info/Parts";
import { Mapping } from "@/utils/interface/mapping";
import { Products } from "@/utils/Enum";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof Mapping.Info)[Products.MAIN][number]]: DetailInfo[key];
};

@Injectable()
class MainboardService extends BaseDetailPartService<Detail> {
  readonly part = Products.MAIN;
}

export { MainboardService };
