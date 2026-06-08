import { z } from "zod";

import { Primitive } from "../../interface";
import { createDTO, createModel } from "../../utils";

const Info = z.object({
  read_speed: Primitive.Number,
  write_speed: Primitive.Number,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  read_speed: "Read Speed",
  write_speed: "Write Speed",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
