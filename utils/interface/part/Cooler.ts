import { FilterOptions } from "../utils";
import { z } from "zod";

export namespace Cooler {
  export const CPUPlates = z.enum(["copper", "alluminium"]);

  export type CPUPlates = z.infer<typeof CPUPlates>;

  export const Schema = z.object({
    socket: z.string(),
    cpu_plate: CPUPlates,

    width: z.number(),
    length: z.number(),
    height: z.number(),
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    socket: true,
    cpu_plate: true,
    height: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      socket: FilterOptions(z.string()),
      cpu_plate: FilterOptions(CPUPlates),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    cpu_plate: CPUPlates.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Cooler;
