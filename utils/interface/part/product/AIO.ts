import { FilterOptions, FormFactor, Material, Primitive } from "../../utils";
import { z } from "zod";

export namespace AIO {
  export const Label = "AIO";

  export const Summary = z
    .object({
      socket: z.array(Primitive.String),
      form_factor: FormFactor.Radiator,
      cpu_plate: Material.Metal,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export const Filter = z
    .object({
      socket: FilterOptions(Primitive.String),
      form_factor: FilterOptions(FormFactor.Radiator),
      cpu_plate: FilterOptions(Material.Metal),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    socket: "Socket",
    form_factor: "Form Factor",
    cpu_plate: "CPU Plate",
  };
}

export default AIO;
