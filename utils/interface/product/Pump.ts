import {
  FilterOptions,
  NumberFilterOptions,
  FormFactor,
  InternalConnectors,
  Primitive,
} from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace Pump {
  export const Label = "Pump";

  export const Primary = [Infos.PUMP];
  export const Secondary = [];

  export const Summary = z
    .object({
      form_factor: FormFactor.Pump,
      head_pressure: Primitive.Number,
      flow_rate: Primitive.Number,
      power_connector: InternalConnectors.Power.Miscellanous,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export const Filter = z
    .object({
      form_factor: FilterOptions(FormFactor.Pump),
      flow_rate: NumberFilterOptions,
      power_connector: FilterOptions(InternalConnectors.Power.Miscellanous),
      control_connector: FilterOptions(InternalConnectors.Fan.Connector),
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    form_factor: "Form Factor",
    head_pressure: "Head Pressure",
    flow_rate: "Flow Rate",
    power_connector: "Power Connector",
    control_connector: "Control Connector",
  };

  export const AttributeMapping: {
    [key in keyof Required<Summary & Filter>]: [Infos, string];
  } = {
    form_factor: [Infos.PUMP, "form_factor"],
    head_pressure: [Infos.PUMP, "head_pressure"],
    flow_rate: [Infos.PUMP, "flow_rate"],
    power_connector: [Infos.PUMP, "power_connector"],
    control_connector: [Infos.PUMP, "control_connector"],
  };
}

export default Pump;
