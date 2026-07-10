import { z } from "zod";

import { InternalConnectors } from "../../interface";
import { MemoryUnits } from "../../Units";
import { createDTO, createModel, createUnit } from "../../utils";

const Info = z.object({
  type: InternalConnectors.RAM,
  capacity: createUnit(MemoryUnits, "MB"),
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  type: "Cache Memory Type",
  capacity: "Cache Capacity",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
