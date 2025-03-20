import { FilterOptions, Material, Primitive } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace Cooler {
  export const Label = "Cooler";

  export const Primary = [Infos.CPU_BLOCK, Infos.FAN, Infos.RADIATOR];
  export const Secondary = [];

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

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    socket: "Socket",
    cpu_plate: "CPU Plate",
    height: "Height",
  };

  export const AttributeMapping: {
    [key in keyof Required<Summary & Filter>]: [Infos, string];
  } = {
    socket: [Infos.CPU_BLOCK, "socket"],
    cpu_plate: [Infos.CPU_BLOCK, "plate"],
    height: [Infos.RADIATOR, "height"],
  };
}

export default Cooler;
