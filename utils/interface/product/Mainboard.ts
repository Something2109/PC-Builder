import {
  FilterOptions,
  FormFactor,
  InternalConnectors,
  Primitive,
} from "../utils";
import { Info } from "../../Enum";
import { z } from "zod";

export namespace Mainboard {
  export const Label = "Mainboard";

  export const Primary = [Info.MAIN];
  export const Secondary = [];

  export const Filter = z
    .object({
      socket: FilterOptions(Primitive.String),
      form_factor: FilterOptions(FormFactor.Mainboard),
      ram_form_factor: FilterOptions(FormFactor.RAM),
      ram_interface: FilterOptions(InternalConnectors.RAM),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default Mainboard;
