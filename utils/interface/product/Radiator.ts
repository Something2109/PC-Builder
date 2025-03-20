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

  export const Summary = z
    .object({
      form_factor: FormFactor.Radiator,
      material: Material.Metal,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    form_factor: "Form Factor",
    material: "Material",
  };

  export const AttributeMapping: {
    [key in keyof Required<Summary & Filter>]: [Infos, string];
  } = {
    form_factor: [Infos.RADIATOR, "form_factor"],
    material: [Infos.RADIATOR, "material"],
  };
}

export default Radiator;
