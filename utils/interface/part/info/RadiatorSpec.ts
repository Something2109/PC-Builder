import {
  createDTO,
  createModel,
  FormFactor,
  Material,
  Primitive,
} from "../../utils";
import { z } from "zod";

const Info = z.object({
  form_factor: FormFactor.Radiator,

  width: Primitive.Number,
  length: Primitive.Number,
  height: Primitive.Number,

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
