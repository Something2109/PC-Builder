import { FormFactor, FilterOptions } from "../utils";
import { z } from "zod";

export namespace Radiator {
  export const Material = z.enum(["Aluminum", "Copper"]);

  export type Material = z.infer<typeof Material>;

  export const Schema = z.object({
    form_factor: FormFactor.Radiator,

    width: z.number(),
    length: z.number(),
    height: z.number(),

    fpi: z.number(),
    material: Material,
  });

  export type Info = z.infer<typeof Schema>;

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
      material: FilterOptions(Material),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.Radiator.options,
    material: Material.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Radiator;
