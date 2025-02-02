import { FormFactor, FilterOptions, NumberFilterOptions } from "../utils";
import { z } from "zod";

export namespace PSU {
  export const Modular = z.enum([
    "Non-Modular",
    "Semi-Modular",
    "Full-Modular",
  ]);

  export type Modular = z.infer<typeof Modular>;

  export const Efficiency = z.enum([
    "None",
    "80 Plus",
    "80 PLUS Bronze",
    "80 PLUS Silver",
    "80 PLUS Gold",
    "80 PLUS Platinum",
    "80 PLUS Titanium",
  ]);

  export type Efficiency = z.infer<typeof Efficiency>;

  export const Schema = z.object({
    wattage: z.number(),
    efficiency: Efficiency,

    form_factor: FormFactor.PSU,
    width: z.number(),
    length: z.number(),
    height: z.number(),
    modular: Modular,

    atx_pin: z.number(),
    cpu_pin: z.number(),
    pcie_pin: z.number(),
    sata_pin: z.number(),
    peripheral_pin: z.number(),
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    wattage: "Wattage",
    efficiency: "Efficiency",

    form_factor: "Form Factor",
    width: "Width",
    length: "Length",
    height: "Height",
    modular: "Modular Type",

    atx_pin: "ATX Pins",
    cpu_pin: "CPU Pins",
    pcie_pin: "PCIe Pins",
    sata_pin: "SATA Pins",
    peripheral_pin: "Peripheral Pins",
  };

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
      efficiency: FilterOptions(Efficiency),
      form_factor: FilterOptions(FormFactor.PSU),
      modular: FilterOptions(Modular),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    efficiency: Efficiency.options,
    form_factor: FormFactor.PSU.options,
    modular: Modular.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default PSU;
