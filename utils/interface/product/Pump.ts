import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  InternalConnectors,
} from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace Pump {
  export const Label = "Pump";

  export const Primary = [Infos.PUMP];
  export const Secondary = [];

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.Pump),
      flow_rate: NumberFilterOptions,
      power_connector: FilterOptions(InternalConnectors.Power.Miscellanous),
      control_connector: FilterOptions(InternalConnectors.Fan.Connector),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;
}

export default Pump;
