import { FormFactor, InternalConnectors, Primitive } from "../../utils";
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

  export const Schema = z.object({
    form_factor: FormFactor.Mainboard,

    socket: Primitive.String,
    chipset: Primitive.String,

    ram_form_factor: FormFactor.RAM,
    ram_interface: InternalConnectors.RAM,
    ram_slot: Primitive.Number,

    power_connectors: PowerConnectorSchema,
    fan_connectors: FanConnectorSchema,
    miscelanous_connectors: z.record(
      InternalConnectors.Miscellanous,
      Primitive.Number
    ),
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
  };
}

export default MainboardSpec;
