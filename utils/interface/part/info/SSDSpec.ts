import {
  createDTO,
  createModel,
  FormFactor,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

export const MemoryCell = z.enum(["SLC", "MLC", "TLC", "QLC", "3D"]);

export type MemoryCell = z.infer<typeof MemoryCell>;

const Info = z.object({
  memory_type: MemoryCell,
  capacity: Primitive.Number,
  tbw: Primitive.Number,

  form_factor: FormFactor.SSD,
  interface: InternalConnectors.Storage.SSD,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  memory_type: "Memory Cell",
  capacity: "Capacity",
  tbw: "TBW",

  form_factor: "Form Factor",
  interface: "Interface",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
