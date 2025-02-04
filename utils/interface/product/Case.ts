import { FilterOptions, FormFactor } from "../utils";
import { Info } from "../../Enum";
import { z } from "zod";

export namespace Case {
  export const Label = "Case";

  export const Primary = [Info.CASE];
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
}

export default Case;
