import { z } from "zod";

import { FormFactor, InternalConnectors, Primitive } from "../../interface";
import { createDTO, createModel } from "../../utils";

const Info = z.object({
  rotational_speed: Primitive.Number,
  capacity: Primitive.Number,

  form_factor: FormFactor.HDD,
  interface: InternalConnectors.Storage.HDD,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  rotational_speed: "Rotational Speed",
  capacity: "Capacity",

  form_factor: "Form Factor",
  interface: "Interface",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
