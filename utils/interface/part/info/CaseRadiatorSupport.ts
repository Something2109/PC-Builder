import { Case, FormFactor } from "../../utils";
import { z } from "zod";

const Info = z.object({
  case_side: Case.Side,
  form_factor: FormFactor.Radiator,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  case_side: "Case Side",
  form_factor: "Radiator Support",
};

const Model = Info;

export type Model = z.infer<typeof Model>;

const DTO = Info;

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
