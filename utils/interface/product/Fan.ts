import { FilterOptions, FormFactor } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";
import Fan from "../info/Fan";

export namespace FanProduct {
  export const Label = "Fan";

  export const Primary = [Infos.FAN];
  export const Secondary = [];

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.Fan),
      bearing: FilterOptions(Fan.Bearing),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const FilterMapping: Record<keyof Filter, [Infos, string]> = {
    form_factor: [Infos.FAN, "form_factor"],
    bearing: [Infos.FAN, "bearing"],
  };
}

export default FanProduct;
