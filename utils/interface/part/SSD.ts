import {
  FormFactor,
  SSDMemoryCells,
  FilterOptions,
  NumberFilterOptions,
  InternalConnectors,
} from "../utils";
import { z } from "zod";

namespace SSD {
  export const Schema = z.object({
    memory_type: SSDMemoryCells,
    read_speed: z.number(),
    write_speed: z.number(),
    capacity: z.number(),
    cache: z.number(),
    tbw: z.number(),

    form_factor: FormFactor.SSD,
    interface: InternalConnectors.Storage.SSD,
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    form_factor: true,
    interface: true,
    read_speed: true,
    write_speed: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      memory_type: FilterOptions(SSDMemoryCells),
      form_factor: FilterOptions(FormFactor.SSD),
      interface: FilterOptions(InternalConnectors.Storage.SSD),
      read_speed: NumberFilterOptions,
      write_speed: NumberFilterOptions,
      capacity: NumberFilterOptions,
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    memory_type: SSDMemoryCells.options,
    form_factor: FormFactor.SSD.options,
    interface: InternalConnectors.Storage.SSD.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default SSD;
