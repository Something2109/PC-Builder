import { FormFactor, Material, FilterOptions, Primitive } from "../../utils";
import { z } from "zod";

export namespace Radiator {
  export const Schema = z.object({
    form_factor: FormFactor.Radiator,

    width: Primitive.Number,
    length: Primitive.Number,
    height: Primitive.Number,

    fpi: Primitive.Number,
    material: Material.Metal,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",

    width: "Width",
    length: "Length",
    height: "Height",

    fpi: "FPI",
    material: "Material",
  };

  export const SummarySchema = Schema.pick({
    form_factor: true,
    material: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.Radiator),
      material: FilterOptions(Material.Metal),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.Radiator.options,
    material: Material.Metal.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Radiator;
