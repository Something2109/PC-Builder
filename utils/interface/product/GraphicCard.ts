import { NumberFilterOptions } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace GraphicCard {
  export const Label = "Graphic Card";

  export const Primary = [Infos.GRAPHIC_CARD];
  export const Secondary = [];

  export const Filter = z
    .object({
      length: NumberFilterOptions,
      base_frequency: NumberFilterOptions,
      boost_frequency: NumberFilterOptions,
      width: NumberFilterOptions,
      height: NumberFilterOptions,
      minimum_psu: NumberFilterOptions,
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: { [key in keyof Required<Filter>]: string } = {
    length: "Length",
    base_frequency: "Base Frequency",
    boost_frequency: "Boost Frequency",
    width: "Width",
    height: "Height",
    minimum_psu: "Minimum PSU",
  };

  export const AttributeMapping: Record<keyof Filter, [Infos, string]> = {
    length: [Infos.GRAPHIC_CARD, "length"],
    base_frequency: [Infos.GRAPHIC_CARD, "base_frequency"],
    boost_frequency: [Infos.GRAPHIC_CARD, "boost_frequency"],
    width: [Infos.GRAPHIC_CARD, "width"],
    height: [Infos.GRAPHIC_CARD, "height"],
    minimum_psu: [Infos.GRAPHIC_CARD, "minimum_psu"],
  };
}

export default GraphicCard;
