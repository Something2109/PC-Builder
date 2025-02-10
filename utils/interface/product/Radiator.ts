import { FilterOptions, FormFactor, Material } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace Radiator {
  export const Label = "Radiator";

  export const Primary = [Infos.RADIATOR];
  export const Secondary = [];

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.Radiator),
      material: FilterOptions(Material.Metal),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default Radiator;
