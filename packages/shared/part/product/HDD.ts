import { FormFactor, InternalConnectors, Primitive } from "../../interface";
import { FilterOptions, NumberFilterOptions } from "../../utils";
import { z } from "zod";

export const Label = "HDD";

export const Summary = z
  .object({
    form_factor: FormFactor.HDD,
    interface: InternalConnectors.RAM,
    capacity: Primitive.Number,
    read_speed: Primitive.Number,
    write_speed: Primitive.Number,
  })
  .partial();

export type Summary = z.infer<typeof Summary>;

export const Filter = z
  .object({
    form_factor: FilterOptions(FormFactor.HDD),
    capacity: NumberFilterOptions,
    interface: FilterOptions(InternalConnectors.Storage.HDD),
    read_speed: NumberFilterOptions,
    write_speed: NumberFilterOptions,
    rotational_speed: NumberFilterOptions,
  })
  .partial();

export type Filter = z.infer<typeof Filter>;

export type Attribute = keyof Required<Summary & Filter>;

export const AttributeLabels: { [key in Attribute]: string } = {
  form_factor: "Form Factor",
  capacity: "Capacity",
  interface: "Interface",
  read_speed: "Read Speed",
  write_speed: "Write Speed",
  rotational_speed: "Rotational Speed",
};
