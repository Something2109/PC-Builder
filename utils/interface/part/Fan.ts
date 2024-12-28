import { FilterOptions, FanBearings, FormFactor } from "../utils";
import { z } from "zod";

namespace Fan {
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
    bearing: FanBearings,
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
      bearing: FilterOptions(FanBearings),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.Fan.options,
    bearing: FanBearings.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Fan;
