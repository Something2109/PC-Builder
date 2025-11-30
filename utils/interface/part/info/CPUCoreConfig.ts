import { createDTO, createModel, Primitive } from "../../utils";
import { z } from "zod";

const Info = z.object({
  name: Primitive.String,
  count: Primitive.Number,

  base_frequency: Primitive.Number,
  turbo_frequency: Primitive.Number,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  name: "Core Name",
  count: "Count",

  base_frequency: "Base Frequency",
  turbo_frequency: "Turbo Frequency",
};

const Required = ["name"] as const;

const Model = createModel(Info, [...Required]);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info, [...Required]);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
