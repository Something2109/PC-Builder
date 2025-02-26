import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/info/Parts";
import GraphicCard from "@/utils/interface/product/GraphicCard";
import { Products, Infos } from "@/utils/Enum";
import { DetailInfo, FilterOptions } from "@/utils/interface";
import { BaseDetailPartService } from "../interface/service.interface";
import { FilterOptionBuilder } from "../interface/filterbuilder";

type Detail = Part.BasicInfo & {
  [key in (typeof GraphicCard.Primary)[number]]: DetailInfo[key];
};

@Injectable()
class GraphicCardService extends BaseDetailPartService<Detail> {
  readonly part = Products.GRAPHIC_CARD;

  options(params: Record<string, string | string[]>) {
    const result = super.options(params);

    const parsedParams = GraphicCard.Filter.parse(params);
    const options = new FilterOptionBuilder<
      NonNullable<FilterOptions[Infos.GRAPHIC_CARD]>
    >()
      .add("length", parsedParams["length"])
      .add("base_frequency", parsedParams["base_frequency"])
      .add("boost_frequency", parsedParams["boost_frequency"])
      .add("width", parsedParams["width"])
      .add("height", parsedParams["height"])
      .add("minimum_psu", parsedParams["minimum_psu"]);

    if (options.build()) result[Infos.GRAPHIC_CARD] = options.build();

    return result;
  }
}

export { GraphicCardService };
