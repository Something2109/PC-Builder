import { Material, Primitive } from "../../interface";
import { FilterOptions } from "../../utils";
import { z } from "zod";

export const Label = "Cooler";

export const Summary = z
  .object({
    socket: Primitive.String,
    cpu_plate: Material.Metal,
    height: Primitive.Number,
  })
  .partial();

export type Summary = z.infer<typeof Summary>;

export const Filter = z
  .object({
    socket: FilterOptions(Primitive.String),
    cpu_plate: FilterOptions(Material.Metal),
  })
  .partial();

export type Filter = z.infer<typeof Filter>;

export type Attribute = keyof Required<Summary & Filter>;

export const AttributeLabels: { [key in Attribute]: string } = {
  socket: "Socket",
  cpu_plate: "CPU Plate",
  height: "Height",
};
