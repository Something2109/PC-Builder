import { z } from "zod";

import { FormFactor } from "../../interface";

const Info = z.object({
  form_factor: FormFactor.Mainboard,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  form_factor: "Mainboard Support",
};

const Model = Info;

export type Model = z.infer<typeof Model>;

const DTO = Info;

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
