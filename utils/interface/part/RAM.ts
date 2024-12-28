import {
  FormFactor,
  FilterOptions,
  NumberFilterOptions,
  InternalConnectors,
} from "../utils";
import { z } from "zod";

namespace RAM {
  export const Schema = z.object({
    speed: z.number(),
    capacity: z.number(),
    voltage: z.number(),
    latency: z.array(z.number()),
    kit: z.number(),

    form_factor: FormFactor.RAM,
    protocol: InternalConnectors.RAM,
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    speed: true,
    capacity: true,
    form_factor: true,
    protocol: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      capacity: NumberFilterOptions,
      form_factor: FilterOptions(FormFactor.RAM),
      protocol: FilterOptions(InternalConnectors.RAM),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.RAM.options,
    protocol: InternalConnectors.RAM.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default RAM;
