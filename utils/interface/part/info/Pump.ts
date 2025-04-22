import {
  FormFactor,
  FilterOptions,
  InternalConnectors,
  NumberFilterOptions,
  Primitive,
} from "../../utils";
import { z } from "zod";

export namespace Pump {
  export const Schema = z.object({
    form_factor: FormFactor.Pump,

    width: Primitive.Number,
    length: Primitive.Number,
    height: Primitive.Number,

    voltage: Primitive.Number,
    wattage: Primitive.Number,
    head_pressure: Primitive.Number,
    flow_rate: Primitive.Number,

    power_connector: InternalConnectors.Power.Miscellanous,
    control_connector: InternalConnectors.Fan.Connector,
    rgb: InternalConnectors.RGB,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",

    width: "Width",
    length: "Length",
    height: "Height",

    voltage: "Voltage",
    wattage: "Wattage",
    head_pressure: "Head Pressure",
    flow_rate: "Flow Rate",

    power_connector: "Power Connector",
    control_connector: "Control Connector",
    rgb: "RGB",
  };

  export const SummarySchema = Schema.pick({
    head_pressure: true,
    flow_rate: true,
    power_connector: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.Pump),
      flow_rate: NumberFilterOptions,
      power_connector: FilterOptions(InternalConnectors.Power.Miscellanous),
      control_connector: FilterOptions(InternalConnectors.Fan.Connector),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.Pump.options,
    power_connector: InternalConnectors.Power.Miscellanous.options,
    control_connector: InternalConnectors.Fan.Connector.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Pump;
