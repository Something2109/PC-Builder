import { FilterOptions, Material, Primitive } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace Cooler {
  export const Label = "Cooler";

  export const Primary = [Infos.CPU_BLOCK, Infos.FAN, Infos.RADIATOR];
  export const Secondary = [];

  export const Filter = z
    .object({
      socket: FilterOptions(Primitive.String),
      cpu_plate: FilterOptions(Material.Metal),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default Cooler;
