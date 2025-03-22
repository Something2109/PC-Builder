import { FilterOptions, FormFactor, Case as CasePlace } from "../utils";
import { z } from "zod";

export namespace Case {
  export const Label = "Case";

  export const Summary = z
    .object({
      form_factor: FormFactor.Case,
      mainboard_support: z.array(FormFactor.Mainboard),
      radiator_support: z.record(CasePlace.Side, z.array(FormFactor.Radiator)),
      psu_support: z.array(FormFactor.PSU),
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.Case),
      mainboard_support: FilterOptions(FormFactor.Mainboard),
      radiator_support: FilterOptions(FormFactor.Radiator),
      psu_support: FilterOptions(FormFactor.PSU),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    form_factor: "Form Factor",
    mainboard_support: "Mainboard Support",
    radiator_support: "Radiator Support",
    psu_support: "PSU Support",
  };
}

export default Case;
