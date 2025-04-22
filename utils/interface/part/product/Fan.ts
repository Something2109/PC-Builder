import { FilterOptions, FormFactor, Primitive } from "../../utils";
import Fan from "../info/FanSpec";
import { z } from "zod";

export namespace FanProduct {
  export const Label = "Fan";

  export const Summary = z
    .object({
      form_factor: FormFactor.Fan,
      bearing: Fan.Bearing,
      speed: Primitive.Number,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.Fan),
      bearing: FilterOptions(Fan.Bearing),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    form_factor: "Form Factor",
    bearing: "Bearing",
    speed: "Speed",
  };
}

export default FanProduct;
