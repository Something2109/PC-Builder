import { FilterOptions, InternalConnectors } from "../utils";
import { z } from "zod";

export namespace CPUBlock {
  export const Plate = z.enum(["copper", "alluminium"]);

  export type Plate = z.infer<typeof Plate>;

  export const Schema = z.object({
    socket: z.array(z.string()),
    plate: Plate,
    rgb: InternalConnectors.RGB,
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    socket: true,
    plate: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      socket: FilterOptions(z.string()),
      plate: FilterOptions(Plate),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {};

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default CPUBlock;
