import { FilterOptions, FormFactor, Material, Primitive } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace AIO {
  export const Label = "AIO";

  export const Primary = [
    Infos.CPU_BLOCK,
    Infos.FAN,
    Infos.PUMP,
    Infos.RADIATOR,
  ];
  export const Secondary = [];

  export const Filter = z
    .object({
      socket: FilterOptions(Primitive.String),
      form_factor: FilterOptions(FormFactor.Radiator),
      cpu_plate: FilterOptions(Material.Metal),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const FilterMapping: Record<keyof Filter, [Infos, string]> = {
    socket: [Infos.CPU_BLOCK, "socket"],
    form_factor: [Infos.RADIATOR, "form_factor"],
    cpu_plate: [Infos.CPU_BLOCK, "plate"],
  };
}

export default AIO;
