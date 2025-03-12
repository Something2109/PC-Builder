import {
  FilterOptions,
  FormFactor,
  InternalConnectors,
  Primitive,
} from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace Mainboard {
  export const Label = "Mainboard";

  export const Primary = [Infos.MAIN];
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

  export const FilterLabels: { [key in keyof Required<Filter>]: string } = {
    socket: "Socket",
    form_factor: "Form Factor",
    ram_form_factor: "RAM Form Factor",
    ram_interface: "RAM Interface",
  };

  export const FilterMapping: Record<keyof Filter, [Infos, string]> = {
    socket: [Infos.MAIN, "socket"],
    form_factor: [Infos.MAIN, "form_factor"],
    ram_form_factor: [Infos.MAIN, "ram_form_factor"],
    ram_interface: [Infos.MAIN, "ram_interface"],
  };
}

export default Mainboard;
