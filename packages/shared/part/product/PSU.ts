import { z } from "zod";

import { FormFactor, Primitive } from "../../interface";
import { FilterOptions, NumberFilterOptions } from "../../utils";
import * as PSU from "../info/PSUSpec";

export const Label = "PSU";

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

export type Attribute = keyof Required<Summary & Filter>;

export const AttributeLabels: { [key in Attribute]: string } = {
  form_factor: "Form Factor",
  wattage: "Wattage",
  efficiency: "Efficiency",
  modular: "Modular",
};
