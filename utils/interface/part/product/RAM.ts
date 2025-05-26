import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

export namespace RAM {
  export const Label = "RAM";

  export const Summary = z
    .object({
      speed: Primitive.Number,
      form_factor: FormFactor.RAM,
      capacity: Primitive.Number,
      interface: InternalConnectors.RAM,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.RAM),
      capacity: NumberFilterOptions,
      interface: FilterOptions(InternalConnectors.RAM),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export type Attribute = keyof Required<Summary & Filter>;

  export const AttributeLabels: { [key in Attribute]: string } = {
    speed: "Speed",
    form_factor: "Form Factor",
    capacity: "Capacity",
    interface: "Interface",
  };
}

export default RAM;
