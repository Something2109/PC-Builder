import { FilterOptions, NumberFilterOptions, FormFactor } from "../utils";
import PSU from "../part/PSU";
import { Info } from "../../Enum";
import { z } from "zod";

export namespace PSUProduct {
  export const Label = "PSU";

  export const Primary = [Info.PSU];
  export const Secondary = [];

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.PSU),
      wattage: NumberFilterOptions,
      efficiency: NumberFilterOptions,
      modular: FilterOptions(PSU.Modular),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default PSUProduct;
