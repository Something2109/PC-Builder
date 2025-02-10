import { NumberFilterOptions } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace GraphicCard {
  export const Label = "Graphic Card";

  export const Primary = [Infos.GRAPHIC_CARD];
  export const Secondary = [];

  export const Filter = z
    .object({
      length: NumberFilterOptions,
      base_frequency: NumberFilterOptions,
      boost_frequency: NumberFilterOptions,
      width: NumberFilterOptions,
      height: NumberFilterOptions,
      minimum_psu: NumberFilterOptions,
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default GraphicCard;
