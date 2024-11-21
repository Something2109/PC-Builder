import {
  MainboardFormFactors,
  RAMFormFactors,
  RAMProtocols,
  FilterOptions,
} from "../utils";
import { z } from "zod";

namespace Mainboard {
  export const Schema = z.object({
    form_factor: MainboardFormFactors,

    socket: z.string(),

    ram_form_factor: RAMFormFactors,
    ram_protocol: RAMProtocols,
    ram_slot: z.number(),
    expansion_slots: z.number(),

    io_ports: z.object({}),
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    form_factor: true,
    socket: true,
    ram_form_factor: true,
    ram_protocol: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(MainboardFormFactors),
      socket: FilterOptions(z.string()),
      ram_form_factor: FilterOptions(RAMFormFactors),
      ram_protocol: FilterOptions(RAMProtocols),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: MainboardFormFactors.options,
    ram_form_factor: RAMFormFactors.options,
    ram_protocol: RAMProtocols.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Mainboard;
