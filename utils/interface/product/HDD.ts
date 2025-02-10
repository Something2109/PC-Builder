import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  InternalConnectors,
} from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace HDD {
  export const Label = "HDD";

  export const Primary = [Infos.HDD];
  export const Secondary = [];

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.HDD),
      capacity: NumberFilterOptions,
      interface: FilterOptions(InternalConnectors.Storage.HDD),
      read_speed: NumberFilterOptions,
      write_speed: NumberFilterOptions,
      rotational_speed: NumberFilterOptions,
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default HDD;
