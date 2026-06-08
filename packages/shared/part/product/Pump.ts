import { z } from "zod";

import { FormFactor, InternalConnectors, Primitive } from "../../interface";
import { FilterOptions, NumberFilterOptions } from "../../utils";

export const Label = "Pump";

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

export type Attribute = keyof Required<Summary & Filter>;

export const AttributeLabels: { [key in Attribute]: string } = {
  form_factor: "Form Factor",
  head_pressure: "Head Pressure",
  flow_rate: "Flow Rate",
  power_connector: "Power Connector",
  control_connector: "Control Connector",
};
