import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import GraphicCard from "@/utils/interface/product/GraphicCard";
import { Products, Info } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [Info.GRAPHIC_CARD]: DetailInfo[Info.GRAPHIC_CARD];
};

@Injectable()
class GraphicCardService extends BaseDetailPartService<Detail> {
  readonly part = Products.GRAPHIC_CARD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = GraphicCard.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Info.GRAPHIC_CARD]>
    >()
      .add("length", parsedParams["length"])
      .add("base_frequency", parsedParams["base_frequency"])
      .add("boost_frequency", parsedParams["boost_frequency"])
      .add("width", parsedParams["width"])
      .add("height", parsedParams["height"])
      .add("minimum_psu", parsedParams["minimum_psu"]);

    if (options.build()) result[Info.GRAPHIC_CARD] = options.build();

    return result;
  }
}

export { GraphicCardService };
