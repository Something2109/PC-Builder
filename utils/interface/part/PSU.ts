import { FormFactor, FilterOptions, NumberFilterOptions } from "../utils";
import { z } from "zod";

export namespace PSU {
  export const Modulars = z.enum([
    "Non-Modular",
    "Semi-Modular",
    "Full-Modular",
  ]);

  export type Modulars = z.infer<typeof Modulars>;

  export const Efficiencies = z.enum([
    "None",
    "80 Plus",
    "80 PLUS Bronze",
    "80 PLUS Silver",
    "80 PLUS Gold",
    "80 PLUS Platinum",
    "80 PLUS Titanium",
  ]);

  export type Efficiencies = z.infer<typeof Efficiencies>;

  export const Schema = z.object({
    wattage: z.number(),
    efficiency: Efficiencies,

    form_factor: FormFactor.PSU,
    width: z.number(),
    length: z.number(),
    height: z.number(),
    modular: Modulars,

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
      efficiency: FilterOptions(Efficiencies),
      form_factor: FilterOptions(FormFactor.PSU),
      modular: FilterOptions(Modulars),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    efficiency: Efficiencies.options,
    form_factor: FormFactor.PSU.options,
    modular: Modulars.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default PSU;
