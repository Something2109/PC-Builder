import {
  FormFactor,
  InternalConnectors,
  FilterOptions,
  NumberFilterOptions,
  Primitive,
} from "../../utils";
import { z } from "zod";

export namespace HDD {
  export const Schema = z.object({
    rotational_speed: Primitive.Number,
    read_speed: Primitive.Number,
    write_speed: Primitive.Number,
    capacity: Primitive.Number,
    cache: Primitive.Number,

    form_factor: FormFactor.HDD,
    interface: InternalConnectors.Storage.HDD,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    rotational_speed: "Rotational Speed",
    read_speed: "Read Speed",
    write_speed: "Write Speed",
    capacity: "Capacity",
    cache: "Cache",

    form_factor: "Form Factor",
    interface: "Interface",
  };

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
