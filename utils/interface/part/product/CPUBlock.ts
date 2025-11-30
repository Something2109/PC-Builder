import { FilterOptions, Material, Primitive } from "../../utils";
import { z } from "zod";

export const Label = "CPU Block";

export const Summary = z
  .object({
    socket: z.array(Primitive.String),
    plate: Material.Metal,
  })
  .partial();

export type Summary = z.infer<typeof Summary>;

export const Filter = z
  .object({
    socket: FilterOptions(Primitive.String),
    plate: FilterOptions(Material.Metal),
  })
  .partial();

export type Filter = z.infer<typeof Filter>;

export type Attribute = keyof Required<Summary & Filter>;

export const AttributeLabels: { [key in Attribute]: string } = {
  socket: "Socket",
  plate: "Plate",
};
