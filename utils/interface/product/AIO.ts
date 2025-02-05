import { FilterOptions, FormFactor, Material, Primitive } from "../utils";
import { Info } from "../../Enum";
import { z } from "zod";

export namespace AIO {
  export const Label = "AIO";

  export const Primary = [Info.AIO];
  export const Secondary = [];

  export const Filter = z
    .object({
      socket: FilterOptions(Primitive.String),
      form_factor: FilterOptions(FormFactor.Radiator),
      cpu_plate: FilterOptions(Material.Metal),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default AIO;
