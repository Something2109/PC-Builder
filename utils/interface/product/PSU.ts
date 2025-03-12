import { FilterOptions, NumberFilterOptions, FormFactor } from "../utils";
import PSU from "../info/PSU";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace PSUProduct {
  export const Label = "PSU";

  export const Primary = [Infos.PSU];
  export const Secondary = [];

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.PSU),
      wattage: NumberFilterOptions,
      efficiency: FilterOptions(PSU.Efficiency),
      modular: FilterOptions(PSU.Modular),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const FilterLabels: { [key in keyof Required<Filter>]: string } = {
    form_factor: "Form Factor",
    wattage: "Wattage",
    efficiency: "Efficiency",
    modular: "Modular",
  };

  export const FilterMapping: Record<keyof Filter, [Infos, string]> = {
    form_factor: [Infos.PSU, "form_factor"],
    wattage: [Infos.PSU, "wattage"],
    efficiency: [Infos.PSU, "efficiency"],
    modular: [Infos.PSU, "modular"],
  };
}

export default PSUProduct;
