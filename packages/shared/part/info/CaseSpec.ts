import { z } from "zod";

import { FormFactor, Primitive } from "../../interface";
import { LengthUnits } from "../../Units";
import { createDTO, createModel, createUnit } from "../../utils";

const Info = z.object({
  form_factor: FormFactor.Case,

  width: createUnit(LengthUnits, "mm"),
  length: createUnit(LengthUnits, "mm"),
  height: createUnit(LengthUnits, "mm"),

  expansion_slot: Primitive.Number,

  max_cooler_height: createUnit(LengthUnits, "mm"),
  max_psu_length: createUnit(LengthUnits, "mm"),
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  form_factor: "Form Factor",

  width: "Width",
  length: "Length",
  height: "Height",

  expansion_slot: "Expansion Slot",

  max_cooler_height: "Max Cooler Height",
  max_psu_length: "Max PSU Length",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
