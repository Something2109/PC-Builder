import {
  PSUEfficiencies,
  FormFactor,
  PSUModulars,
  FilterOptions,
  NumberFilterOptions,
} from "../utils";
import { z } from "zod";

export namespace PSU {
  export const Schema = z.object({
    wattage: z.number(),
    efficiency: PSUEfficiencies,

    form_factor: FormFactor.PSU,
    width: z.number(),
    length: z.number(),
    height: z.number(),
    modular: PSUModulars,

    atx_pin: z.number(),
    cpu_pin: z.number(),
    pcie_pin: z.number(),
    sata_pin: z.number(),
    peripheral_pin: z.number(),
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    wattage: true,
    efficiency: true,
    form_factor: true,
    modular: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      wattage: NumberFilterOptions,
      efficiency: FilterOptions(PSUEfficiencies),
      form_factor: FilterOptions(FormFactor.PSU),
      modular: FilterOptions(PSUModulars),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    efficiency: PSUEfficiencies.options,
    form_factor: FormFactor.PSU.options,
    modular: PSUModulars.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default PSU;
