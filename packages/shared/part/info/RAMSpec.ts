import { z } from "zod";

import { FormFactor, InternalConnectors, Primitive } from "../../interface";
import { MemoryUnits, FrequencyUnits } from "../../Units";
import { createDTO, createModel, createUnit, createSuffix } from "../../utils";

const Info = z.object({
  speed: createUnit(FrequencyUnits, "MHz"),
  capacity: createUnit(MemoryUnits, "GB"),
  voltage: createSuffix("V"),
  latency: z.array(Primitive.Number),
  kit: Primitive.Number,

  form_factor: FormFactor.RAM,
  interface: InternalConnectors.RAM,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  speed: "Speed",
  capacity: "Capacity",
  voltage: "Voltage",
  latency: "Latency",
  kit: "Kit",

  form_factor: "Form Factor",
  interface: "Interface",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
