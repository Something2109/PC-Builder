import { FormFactor, FilterOptions } from "../utils";
import { z } from "zod";

export namespace AIO {
  export const CPUPlates = z.enum(["copper", "alluminium"]);

  export type CPUPlates = z.infer<typeof CPUPlates>;

  export const Schema = z.object({
    form_factor: FormFactor.AIO,

    radiator_width: z.number(),
    radiator_length: z.number(),
    radiator_height: z.number(),

    socket: z.string(),
    cpu_plate: CPUPlates,

    pump_width: z.number(),
    pump_length: z.number(),
    pump_height: z.number(),
    pump_speed: z.number(),
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    form_factor: true,
    socket: true,
    cpu_plate: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.AIO),
      socket: FilterOptions(z.string()),
      cpu_plate: FilterOptions(CPUPlates),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.AIO.options,
    cpu_plate: CPUPlates.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default AIO;
