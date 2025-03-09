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

  export const FilterLabels: { [key in keyof Required<Filter>]: string } = {
    form_factor: "Form Factor",
    material: "Material",
  };

  export const FilterMapping: Record<keyof Filter, [Infos, string]> = {
    form_factor: [Infos.RADIATOR, "form_factor"],
    material: [Infos.RADIATOR, "material"],
  };
}

export default Radiator;
