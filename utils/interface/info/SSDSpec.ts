import {
  FormFactor,
  FilterOptions,
  NumberFilterOptions,
  InternalConnectors,
  Primitive,
} from "../utils";
import { z } from "zod";

namespace SSDSpec {
  export const MemoryCell = z.enum(["SLC", "MLC", "TLC", "QLC", "3D"]);

  export type MemoryCell = z.infer<typeof MemoryCell>;

  export const Schema = z.object({
    memory_type: MemoryCell,
    capacity: Primitive.Number,
    cache: Primitive.Number,
    tbw: Primitive.Number,

    form_factor: FormFactor.SSD,
    interface: InternalConnectors.Storage.SSD,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    memory_type: "Memory Cell",
    capacity: "Capacity",
    cache: "Cache",
    tbw: "TBW",

    form_factor: "Form Factor",
    interface: "Interface",
  };
}

export default SSDSpec;
