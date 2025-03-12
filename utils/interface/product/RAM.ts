import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  InternalConnectors,
} from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace RAM {
  export const Label = "RAM";

  export const Primary = [Infos.RAM];
  export const Secondary = [];

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.RAM),
      capacity: NumberFilterOptions,
      interface: FilterOptions(InternalConnectors.RAM),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const FilterLabels: { [key in keyof Required<Filter>]: string } = {
    form_factor: "Form Factor",
    capacity: "Capacity",
    interface: "Interface",
  };

  export const FilterMapping: Record<keyof Filter, [Infos, string]> = {
    form_factor: [Infos.RAM, "form_factor"],
    capacity: [Infos.RAM, "capacity"],
    interface: [Infos.RAM, "interface"],
  };
}

export default RAM;
