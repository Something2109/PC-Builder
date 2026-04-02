import { FormFactor } from "../../interface";
import { z } from "zod";

const Info = z.object({
  psu_support: FormFactor.PSU,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  psu_support: "PSU Support",
};

const Model = Info;

export type Model = z.infer<typeof Model>;

const DTO = Info;

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
