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
}

export default RAM;
