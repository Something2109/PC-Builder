import { FormFactor, FilterOptions, Material, Primitive } from "../utils";
import { z } from "zod";

export namespace AIO {
  export const Schema = z.object({
    form_factor: FormFactor.Radiator,

    radiator_width: Primitive.Number,
    radiator_length: Primitive.Number,
    radiator_height: Primitive.Number,

    socket: Primitive.String,
    cpu_plate: Material.Metal,

    pump_width: Primitive.Number,
    pump_length: Primitive.Number,
    pump_height: Primitive.Number,
    pump_speed: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",

    radiator_width: "Radiator Width",
    radiator_length: "Radiator Length",
    radiator_height: "Radiator Height",

    socket: "Socket",
    cpu_plate: "CPU Plate",

    pump_width: "Pump Width",
    pump_length: "Pump Length",
    pump_height: "Pump Height",
    pump_speed: "Pump Speed",
  };

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
      form_factor: FilterOptions(FormFactor.Radiator),
      socket: FilterOptions(Primitive.String),
      cpu_plate: FilterOptions(Material.Metal),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.Radiator.options,
    cpu_plate: Material.Metal.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default AIO;
