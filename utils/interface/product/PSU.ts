import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  Primitive,
} from "../utils";
import PSU from "../info/PSU";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace PSUProduct {
  export const Label = "PSU";

  export const Primary = [Infos.PSU];
  export const Secondary = [];

  export const Summary = z
    .object({
      form_factor: FormFactor.PSU,
      wattage: Primitive.Number,
      efficiency: PSU.Efficiency,
      modular: PSU.Modular,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.PSU),
      wattage: NumberFilterOptions,
      efficiency: FilterOptions(PSU.Efficiency),
      modular: FilterOptions(PSU.Modular),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    form_factor: "Form Factor",
    wattage: "Wattage",
    efficiency: "Efficiency",
    modular: "Modular",
  };

  export const AttributeMapping: {
    [key in keyof Required<Summary & Filter>]: [Infos, string];
  } = {
    form_factor: [Infos.PSU, "form_factor"],
    wattage: [Infos.PSU, "wattage"],
    efficiency: [Infos.PSU, "efficiency"],
    modular: [Infos.PSU, "modular"],
  };
}

export default PSUProduct;
