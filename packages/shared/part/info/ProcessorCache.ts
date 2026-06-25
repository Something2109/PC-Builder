import { z } from "zod";

import { MemoryUnits } from "../../Units";
import { createDTO, createModel, createUnit } from "../../utils";

const Info = z.object({
  L1_cache: createUnit(MemoryUnits, "MB"),
  L2_cache: createUnit(MemoryUnits, "MB"),
  L3_cache: createUnit(MemoryUnits, "MB"),
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  L1_cache: "L1 Cache",
  L2_cache: "L2 Cache",
  L3_cache: "L3 Cache",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
