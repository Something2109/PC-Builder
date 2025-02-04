import { FilterOptions, NumberFilterOptions, Primitive } from "../utils";
import { Info } from "../../Enum";
import { z } from "zod";

export namespace CPU {
  export const Label = "CPU";

  export const Primary = [Info.CPU];
  export const Secondary = [Info.GPU];

  export const Filter = z
    .object({
      socket: FilterOptions(Primitive.String),
      total_cores: NumberFilterOptions,
      total_threads: NumberFilterOptions,
      base_frequency: NumberFilterOptions,
      turbo_frequency: NumberFilterOptions,
      L3_cache: NumberFilterOptions,
      tdp: NumberFilterOptions,
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default CPU;
