import { FilterOptions, FormFactor, Primitive } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";
import Fan from "../info/Fan";

export namespace FanProduct {
  export const Label = "Fan";

  export const Primary = [Infos.FAN];
  export const Secondary = [];

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

  export const AttributeMapping: {
    [key in keyof Required<Summary & Filter>]: [Infos, string];
  } = {
    form_factor: [Infos.FAN, "form_factor"],
    bearing: [Infos.FAN, "bearing"],
    speed: [Infos.FAN, "speed"],
  };
}

export default FanProduct;
