import {
  FormFactor,
  FilterOptions,
  NumberFilterOptions,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

namespace RAM {
  export const Schema = z.object({
    speed: Primitive.Number,
    capacity: Primitive.Number,
    voltage: Primitive.Number,
    latency: z.array(Primitive.Number),
    kit: Primitive.Number,

    form_factor: FormFactor.RAM,
    interface: InternalConnectors.RAM,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    speed: "Speed",
    capacity: "Capacity",
    voltage: "Voltage",
    latency: "Latency",
    kit: "Kit",

    form_factor: "Form Factor",
    interface: "Interface",
  };

  export const SummarySchema = Schema.pick({
    speed: true,
    capacity: true,
    form_factor: true,
    interface: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      capacity: NumberFilterOptions,
      form_factor: FilterOptions(FormFactor.RAM),
      interface: FilterOptions(InternalConnectors.RAM),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.RAM.options,
    interface: InternalConnectors.RAM.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default RAM;
