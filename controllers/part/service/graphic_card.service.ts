import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import { Primitive } from "@/utils/interface/utils";
import { Products, Info } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";

type Detail = Part.BasicInfo & {
  [Info.GRAPHIC_CARD]: DetailInfo[Info.GRAPHIC_CARD];
};

@Injectable()
class GraphicCardService extends BaseDetailPartService<Detail> {
  readonly part = Products.GRAPHIC_CARD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const options: FilterOptions[Info.GRAPHIC_CARD] = {};
    this.parse(params, Primitive.Number, options, "length");
    this.parse(params, Primitive.Number, options, "base_frequency");
    this.parse(params, Primitive.Number, options, "boost_frequency");
    this.parse(params, Primitive.Number, options, "width");
    this.parse(params, Primitive.Number, options, "height");
    this.parse(params, Primitive.Number, options, "minimum_psu");

    if (Object.keys(options).length > 0) result[Info.GRAPHIC_CARD] = options;

    return result;
  }
}

export { GraphicCardService };
