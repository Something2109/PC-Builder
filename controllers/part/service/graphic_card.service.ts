import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products, Info } from "@/utils/Enum";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.GRAPHIC_CARD]: GraphicCard.Info;
};

@Injectable()
class GraphicCardService extends BaseDetailPartService<Detail> {
  readonly part = Products.GRAPHIC_CARD;
}

export { GraphicCardService };
