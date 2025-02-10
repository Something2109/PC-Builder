import { FilterOptions, NumberFilterOptions, Primitive } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace GPU {
  export const Label = "GPU";

  export const Primary = [Infos.GPU];
  export const Secondary = [];

  export const Filter = z
    .object({
      base_frequency: NumberFilterOptions,
      boost_frequency: NumberFilterOptions,
      memory_size: NumberFilterOptions,
      memory_type: FilterOptions(Primitive.String),
      tdp: NumberFilterOptions,
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default GPU;
