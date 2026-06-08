import { z } from "zod";

import { Primitive } from "../../interface";

const Info = z.object({
  socket: Primitive.String,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  socket: "Socket Support",
};

const Model = Info;

export type Model = z.infer<typeof Model>;

const DTO = Info;

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
