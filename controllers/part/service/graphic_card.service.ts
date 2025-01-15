import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Primitive } from "@/utils/interface/utils";
import { Products, Info } from "@/utils/Enum";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.GRAPHIC_CARD]: GraphicCard.Info;
};

@Injectable()
class GraphicCardService extends BaseDetailPartService<Detail> {
  readonly part = Products.GRAPHIC_CARD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);
    result[Products.GRAPHIC_CARD] = {};

    const options = result[Products.GRAPHIC_CARD];
    this.parse(params, Primitive.Number, options, "length");
    this.parse(params, Primitive.Number, options, "base_frequency");
    this.parse(params, Primitive.Number, options, "boost_frequency");
    this.parse(params, Primitive.Number, options, "width");
    this.parse(params, Primitive.Number, options, "height");
    this.parse(params, Primitive.Number, options, "minimum_psu");

    return result;
  }
}

export { GraphicCardService };
