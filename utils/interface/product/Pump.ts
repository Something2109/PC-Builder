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

  export const AttributeLabels: { [key in keyof Required<Filter>]: string } = {
    form_factor: "Form Factor",
    flow_rate: "Flow Rate",
    power_connector: "Power Connector",
    control_connector: "Control Connector",
  };

  export const AttributeMapping: Record<keyof Filter, [Infos, string]> = {
    form_factor: [Infos.PUMP, "form_factor"],
    flow_rate: [Infos.PUMP, "flow_rate"],
    power_connector: [Infos.PUMP, "power_connector"],
    control_connector: [Infos.PUMP, "control_connector"],
  };
}

export default Pump;
