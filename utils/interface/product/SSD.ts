import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  InternalConnectors,
  Primitive,
} from "../utils";
import SSD from "../info/SSD";
import { z } from "zod";

export namespace SSDProduct {
  export const Label = "SSD";

  export const Summary = z
    .object({
      form_factor: FormFactor.SSD,
      interface: InternalConnectors.Storage.SSD,
      capacity: Primitive.Number,
      read_speed: Primitive.Number,
      write_speed: Primitive.Number,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export const Filter = z
    .object({
      memory_type: FilterOptions(SSD.MemoryCell),
      form_factor: FilterOptions(FormFactor.SSD),
      capacity: NumberFilterOptions,
      interface: FilterOptions(InternalConnectors.Storage.SSD),
      read_speed: NumberFilterOptions,
      write_speed: NumberFilterOptions,
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    memory_type: "Memory Type",
    form_factor: "Form Factor",
    capacity: "Capacity",
    interface: "Interface",
    read_speed: "Read Speed",
    write_speed: "Write Speed",
  };
}

export default SSDProduct;
