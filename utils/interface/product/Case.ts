import { FilterOptions, FormFactor } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace Case {
  export const Label = "Case";

  export const Primary = [Infos.CASE];
  export const Secondary = [];

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.Case),
      mainboard_support: FilterOptions(FormFactor.Mainboard),
      radiator_support: FilterOptions(FormFactor.Radiator),
      psu_support: FilterOptions(FormFactor.PSU),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: { [key in keyof Required<Filter>]: string } = {
    form_factor: "Form Factor",
    mainboard_support: "Mainboard Support",
    radiator_support: "Radiator Support",
    psu_support: "PSU Support",
  };

  export const AttributeMapping: Record<keyof Filter, [Infos, string]> = {
    form_factor: [Infos.CASE, "form_factor"],
    mainboard_support: [Infos.CASE, "mainboard_support"],
    radiator_support: [Infos.CASE, "radiator_support"],
    psu_support: [Infos.CASE, "psu_support"],
  };
}

export default Case;
