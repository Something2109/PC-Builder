import { z } from "zod";

import { FormFactor, Primitive } from "../../interface";
import { LengthUnits } from "../../Units";
import { createDTO, createModel, createUnit } from "../../utils";

export const Modular = z.enum(["Non-Modular", "Semi-Modular", "Full-Modular"]);

export type Modular = z.infer<typeof Modular>;

export const Efficiency = z.enum([
  "None",
  "80 Plus",
  "80 PLUS Bronze",
  "80 PLUS Silver",
  "80 PLUS Gold",
  "80 PLUS Platinum",
  "80 PLUS Titanium",
]);

export type Efficiency = z.infer<typeof Efficiency>;

const Info = z.object({
  wattage: Primitive.Number,
  efficiency: Efficiency,

  form_factor: FormFactor.PSU,
  width: createUnit(LengthUnits, "mm"),
  length: createUnit(LengthUnits, "mm"),
  height: createUnit(LengthUnits, "mm"),
  modular: Modular,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  wattage: "Wattage",
  efficiency: "Efficiency",

  form_factor: "Form Factor",
  width: "Width",
  length: "Length",
  height: "Height",
  modular: "Modular Type",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
