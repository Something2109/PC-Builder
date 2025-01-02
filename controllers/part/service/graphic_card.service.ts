import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Products.GRAPHIC_CARD]: GraphicCard.Info;
};

@Injectable()
class GraphicCardService extends BaseDetailPartService<Detail> {
  readonly part = Products.GRAPHIC_CARD;
}

export { GraphicCardService };
