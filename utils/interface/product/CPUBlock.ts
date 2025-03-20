import { FilterOptions, Material, Primitive } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace CPUBlock {
  export const Label = "CPU Block";

  export const Primary = [Infos.CPU_BLOCK];
  export const Secondary = [];

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

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    socket: "Socket",
    plate: "Plate",
  };

  export const AttributeMapping: {
    [key in keyof Required<Summary & Filter>]: [Infos, string];
  } = {
    socket: [Infos.CPU_BLOCK, "socket"],
    plate: [Infos.CPU_BLOCK, "plate"],
  };
}

export default CPUBlock;
