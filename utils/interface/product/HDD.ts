import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  InternalConnectors,
  Primitive,
} from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace HDD {
  export const Label = "HDD";

  export const Primary = [Infos.HDD];
  export const Secondary = [];

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

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    form_factor: "Form Factor",
    capacity: "Capacity",
    interface: "Interface",
    read_speed: "Read Speed",
    write_speed: "Write Speed",
    rotational_speed: "Rotational Speed",
  };

  export const AttributeMapping: {
    [key in keyof Required<Summary & Filter>]: [Infos, string];
  } = {
    form_factor: [Infos.HDD, "form_factor"],
    capacity: [Infos.HDD, "capacity"],
    interface: [Infos.HDD, "interface"],
    read_speed: [Infos.HDD, "read_speed"],
    write_speed: [Infos.HDD, "write_speed"],
    rotational_speed: [Infos.HDD, "rotational_speed"],
  };
}

export default HDD;
