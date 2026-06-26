import { z } from "zod";

import { FrequencyUnits } from "../../Units";
import { createDTO, createModel, createUnit, createSuffix } from "../../utils";

const Info = z.object({
  base_frequency: createUnit(FrequencyUnits, "GHz"),
  turbo_frequency: createUnit(FrequencyUnits, "GHz"),

  tdp: createSuffix("W"),
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  base_frequency: "Base Frequency",
  turbo_frequency: "Turbo Frequency",

  tdp: "TDP",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
