import { FilterOptions, FormFactor, Material, Primitive } from "../utils";
import { Info } from "../../Enum";
import { z } from "zod";

export namespace Cooler {
  export const Label = "Cooler";

  export const Primary = [Info.COOLER];
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
