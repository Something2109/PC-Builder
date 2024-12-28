import { FilterOptions, FormFactor } from "../utils";
import { z } from "zod";

namespace Fan {
  export const Bearings = z.enum(["Fluid dynamic", "Ball", "Sleeve", "Rifle"]);

  export type Bearings = z.infer<typeof Bearings>;

  export const Schema = z.object({
    form_factor: FormFactor.Fan,

    width: z.number(),
    length: z.number(),
    height: z.number(),

    voltage: z.number(),

    speed: z.number(),
    airflow: z.number(),
    noise: z.number(),
    static_pressure: z.number(),
    bearing: Bearings,
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    form_factor: true,
    bearing: true,
    speed: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.Fan),
      bearing: FilterOptions(Bearings),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.Fan.options,
    bearing: Bearings.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Fan;
