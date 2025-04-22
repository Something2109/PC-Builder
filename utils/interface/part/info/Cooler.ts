import { FilterOptions, Material, Primitive } from "../../utils";
import { z } from "zod";

export namespace Cooler {
  export const Schema = z.object({
    socket: Primitive.String,
    cpu_plate: Material.Metal,

    width: Primitive.Number,
    length: Primitive.Number,
    height: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    socket: "Socket",
    cpu_plate: "CPU Plate",

    width: "Width",
    length: "Length",
    height: "Height",
  };

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
      socket: FilterOptions(Primitive.String),
      cpu_plate: FilterOptions(Material.Metal),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    cpu_plate: Material.Metal.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Cooler;
