import { FilterOptions, FormFactor } from "../utils";
import { Info } from "../../Enum";
import { z } from "zod";
import Fan from "../info/Fan";

export namespace FanProduct {
  export const Label = "Fan";

  export const Primary = [Info.FAN];
  export const Secondary = [];

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.Fan),
      bearing: FilterOptions(Fan.Bearing),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default FanProduct;
