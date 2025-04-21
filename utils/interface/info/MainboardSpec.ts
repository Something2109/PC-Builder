import {
  FormFactor,
  FilterOptions,
  ExternalPorts,
  InternalConnectors,
  Primitive,
} from "../utils";
import { z } from "zod";

namespace MainboardSpec {
  export const PowerConnectorSchema = z.record(
    InternalConnectors.Power.Mainboard,
    Primitive.Number
  );

  export type PowerConnector = z.infer<typeof PowerConnectorSchema>;

  export const FanConnectorSchema = z.record(
    InternalConnectors.Fan.Schema,
    Primitive.Number
  );

  export type FanConnector = z.infer<typeof FanConnectorSchema>;

  export const BackPanelPortSchema = z.record(
    ExternalPorts.Schema,
    Primitive.Number
  );

  export type BackPanelPort = z.infer<typeof BackPanelPortSchema>;

  export const Schema = z.object({
    form_factor: FormFactor.Mainboard,

    socket: Primitive.String,
    chipset: Primitive.String,

    ram_form_factor: FormFactor.RAM,
    ram_interface: InternalConnectors.RAM,
    ram_slot: Primitive.Number,

    power_connectors: PowerConnectorSchema,
    fan_connectors: FanConnectorSchema,
    miscelanous_connectors: z.record(Primitive.String, Primitive.Number),

    back_panel_ports: BackPanelPortSchema,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",

    socket: "Socket",
    chipset: "Chipset",

    ram_form_factor: "RAM Form Factor",
    ram_interface: "RAM Interface",
    ram_slot: "RAM Slots",

    power_connectors: "Power Connectors",
    fan_connectors: "Fan Connectors",
    miscelanous_connectors: "Misc Connectors",

    back_panel_ports: "Back Panel Ports",
  };

  export const SummarySchema = Schema.pick({
    form_factor: true,
    socket: true,
    ram_form_factor: true,
    ram_interface: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.Mainboard),
      socket: FilterOptions(Primitive.String),
      ram_form_factor: FilterOptions(FormFactor.RAM),
      ram_interface: FilterOptions(InternalConnectors.RAM),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.Mainboard.options,
    ram_form_factor: FormFactor.RAM.options,
    ram_interface: InternalConnectors.RAM.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default MainboardSpec;
