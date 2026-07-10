import { z } from "zod";

import { FormFactor, InternalConnectors } from "../../interface";
import { MemoryUnits } from "../../Units";
import { createDTO, createModel, createUnit } from "../../utils";

export const MemoryCell = z.enum(["SLC", "MLC", "TLC", "QLC", "3D"]);

export type MemoryCell = z.infer<typeof MemoryCell>;

const Info = z.object({
  memory_type: MemoryCell,
  capacity: createUnit(MemoryUnits, "GB"),
  tbw: createUnit(MemoryUnits, "TB"),

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
