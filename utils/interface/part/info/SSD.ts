import {
  FormFactor,
  FilterOptions,
  NumberFilterOptions,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

namespace SSD {
  export const MemoryCell = z.enum(["SLC", "MLC", "TLC", "QLC", "3D"]);

  export type MemoryCell = z.infer<typeof MemoryCell>;

  export const Schema = z.object({
    memory_type: MemoryCell,
    read_speed: Primitive.Number,
    write_speed: Primitive.Number,
    capacity: Primitive.Number,
    cache: Primitive.Number,
    tbw: Primitive.Number,

    form_factor: FormFactor.SSD,
    interface: InternalConnectors.Storage.SSD,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    memory_type: "Memory Cell",
    read_speed: "Read Speed",
    write_speed: "Write Speed",
    capacity: "Capacity",
    cache: "Cache",
    tbw: "TBW",

    form_factor: "Form Factor",
    interface: "Interface",
  };

  export const SummarySchema = Schema.pick({
    form_factor: true,
    interface: true,
    read_speed: true,
    write_speed: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      memory_type: FilterOptions(MemoryCell),
      form_factor: FilterOptions(FormFactor.SSD),
      interface: FilterOptions(InternalConnectors.Storage.SSD),
      read_speed: NumberFilterOptions,
      write_speed: NumberFilterOptions,
      capacity: NumberFilterOptions,
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    memory_type: MemoryCell.options,
    form_factor: FormFactor.SSD.options,
    interface: InternalConnectors.Storage.SSD.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default SSD;
