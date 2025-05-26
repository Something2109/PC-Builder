import { FilterOptions, FormFactor, Material } from "../../utils";
import { z } from "zod";

export namespace Radiator {
  export const Label = "Radiator";

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.Radiator),
      material: FilterOptions(Material.Metal),
    })
    .partial();

  export const Summary = z
    .object({
      form_factor: FormFactor.Radiator,
      material: Material.Metal,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export type Filter = z.infer<typeof Filter>;

  export type Attribute = keyof Required<Summary & Filter>;

  export const AttributeLabels: { [key in Attribute]: string } = {
    form_factor: "Form Factor",
    material: "Material",
  };
}

export default Radiator;
