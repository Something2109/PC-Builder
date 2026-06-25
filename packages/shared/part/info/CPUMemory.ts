import { z } from "zod";

import { InternalConnectors, Primitive } from "../../interface";
import { MemoryUnits, FrequencyUnits, MemorySpeedUnit } from "../../Units";
import { createDTO, createModel, createUnit } from "../../utils";

const Info = z.object({
  type: InternalConnectors.RAM,
  speed: createUnit(FrequencyUnits, "MHz"),
  capacity: createUnit(MemoryUnits, "GB"),
  channel_count: Primitive.Number,
  bandwidth: createUnit(MemorySpeedUnit, "GB/s"),
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  type: "Memory Type",
  speed: "Memory Speed",
  capacity: "Memory Capacity",
  channel_count: "Memory Channel",
  bandwidth: "Memory Bandwidth",
};

const Required = ["type"] as const;

const Model = createModel(Info, [...Required]);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info, [...Required]);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
