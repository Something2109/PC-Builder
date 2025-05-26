import { NumberFilterOptions, Primitive } from "../../utils";
import { z } from "zod";

export namespace GraphicCard {
  export const Label = "Graphic Card";

  export const Summary = z
    .object({
      length: Primitive.Number,
      base_frequency: Primitive.Number,
      boost_frequency: Primitive.Number,
      minimum_psu: Primitive.Number,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

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

  export type Attribute = keyof Required<Summary & Filter>;

  export const AttributeLabels: { [key in Attribute]: string } = {
    length: "Length",
    base_frequency: "Base Frequency",
    boost_frequency: "Boost Frequency",
    width: "Width",
    height: "Height",
    minimum_psu: "Minimum PSU",
  };
}

export default GraphicCard;
