import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  InternalConnectors,
  Primitive,
} from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace RAM {
  export const Label = "RAM";

  export const Primary = [Infos.RAM];
  export const Secondary = [];

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

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    speed: "Speed",
    form_factor: "Form Factor",
    capacity: "Capacity",
    interface: "Interface",
  };

  export const AttributeMapping: {
    [key in keyof Required<Summary & Filter>]: [Infos, string];
  } = {
    speed: [Infos.RAM, "speed"],
    form_factor: [Infos.RAM, "form_factor"],
    capacity: [Infos.RAM, "capacity"],
    interface: [Infos.RAM, "interface"],
  };
}

export default RAM;
