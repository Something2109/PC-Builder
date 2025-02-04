import { FilterOptions, Material, Primitive } from "../utils";
import { Info } from "../../Enum";
import { z } from "zod";

export namespace CPUBlock {
  export const Label = "CPU Block";

  export const Primary = [Info.CPU_BLOCK];
  export const Secondary = [];

  export const Filter = z
    .object({
      socket: FilterOptions(Primitive.String),
      plate: FilterOptions(Material.Metal),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default CPUBlock;
