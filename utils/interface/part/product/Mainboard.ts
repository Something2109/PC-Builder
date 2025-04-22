import {
  FilterOptions,
  FormFactor,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

export namespace Mainboard {
  export const Label = "Mainboard";

  export const Summary = z
    .object({
      socket: Primitive.String,
      form_factor: FormFactor.Mainboard,
      ram_form_factor: FormFactor.RAM,
      ram_interface: InternalConnectors.RAM,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export const Filter = z
    .object({
      socket: FilterOptions(Primitive.String),
      form_factor: FilterOptions(FormFactor.Mainboard),
      ram_form_factor: FilterOptions(FormFactor.RAM),
      ram_interface: FilterOptions(InternalConnectors.RAM),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    socket: "Socket",
    form_factor: "Form Factor",
    ram_form_factor: "RAM Form Factor",
    ram_interface: "RAM Interface",
  };
}

export default Mainboard;
