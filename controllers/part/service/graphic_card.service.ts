import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import GraphicCard from "@/utils/interface/product/GraphicCard";
import { Products } from "@/utils/Enum";
import { DetailInfo } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [key in (typeof GraphicCard.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class GraphicCardService extends BaseDetailPartService<Detail> {
  readonly part = Products.GRAPHIC_CARD;
}

export { GraphicCardService };
