import { Primitive } from "../../interface";
import { createDTO, createModel } from "../../utils";
import { z } from "zod";

const Info = z.object({
  base_frequency: Primitive.Number,
  turbo_frequency: Primitive.Number,

  tdp: Primitive.Number,
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
