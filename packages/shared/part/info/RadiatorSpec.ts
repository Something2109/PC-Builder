import { z } from "zod";

import { FormFactor, Material, Primitive } from "../../interface";
import { LengthUnits } from "../../Units";
import { createDTO, createModel, createUnit } from "../../utils";

const Info = z.object({
  form_factor: FormFactor.Radiator,

  width: createUnit(LengthUnits, "mm"),
  length: createUnit(LengthUnits, "mm"),
  height: createUnit(LengthUnits, "mm"),

  fpi: Primitive.Number,
  material: Material.Metal,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  form_factor: "Form Factor",

  width: "Width",
  length: "Length",
  height: "Height",

  fpi: "FPI",
  material: "Material",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
