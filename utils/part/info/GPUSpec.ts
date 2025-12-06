import { Primitive } from "../../interface";
import { createDTO, createModel } from "../../utils";
import { z } from "zod";

const Info = z.object({
  family: Primitive.String,

  core_count: Primitive.Number,
  rops: Primitive.Number,
  tmus: Primitive.Number,
  execution_unit: Primitive.Number,
  ray_tracing: Primitive.Number,
  tensor: Primitive.Number,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  family: "Family",

  core_count: "Core Count",
  rops: "ROPs",
  tmus: "TMUs",
  execution_unit: "Execution Unit",
  ray_tracing: "Ray Tracing Cores",
  tensor: "Tensor Cores",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
