import {
  FormFactor,
  InternalConnectors,
  FilterOptions,
  NumberFilterOptions,
} from "../utils";
import { z } from "zod";

export namespace HDD {
  export const Schema = z.object({
    rotational_speed: z.number(),
    read_speed: z.number(),
    write_speed: z.number(),
    capacity: z.number(),
    cache: z.number(),

    form_factor: FormFactor.HDD,
    interface: InternalConnectors.Storage.HDD,
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    form_factor: true,
    interface: true,
    capacity: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.HDD),
      interface: FilterOptions(InternalConnectors.Storage.HDD),
      read_speed: NumberFilterOptions,
      write_speed: NumberFilterOptions,
      capacity: NumberFilterOptions,
      rotational_speed: NumberFilterOptions,
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.HDD.options,
    interface: InternalConnectors.Storage.HDD.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default HDD;
