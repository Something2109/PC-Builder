import {
  FilterOptions,
  InternalConnectors,
  Material,
  Primitive,
} from "../../utils";
import { z } from "zod";

export namespace CPUBlock {
  export const Schema = z.object({
    socket: z.array(Primitive.String),
    plate: Material.Metal,
    rgb: InternalConnectors.RGB,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    socket: "Socket",
    plate: "Plate",
    rgb: "RGB",
  };

  export const SummarySchema = Schema.pick({
    socket: true,
    plate: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      socket: FilterOptions(Primitive.String),
      plate: FilterOptions(Material.Metal),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {};

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default CPUBlock;
