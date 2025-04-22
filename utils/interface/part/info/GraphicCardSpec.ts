import { ExternalPorts, InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

namespace GraphicCardSpec {
  export const PowerConnectorSchema = z.record(
    InternalConnectors.Power.GraphicCard,
    Primitive.Number
  );

  export type PowerConnectorType = z.infer<typeof PowerConnectorSchema>;

  export const PortSchema = z.record(
    ExternalPorts.Display.Schema,
    Primitive.Number
  );

  export type Port = z.infer<typeof PortSchema>;

  export const Schema = z.object({
    width: Primitive.Number,
    length: Primitive.Number,
    height: Primitive.Number,

    pcie: Primitive.Number,
    minimum_psu: Primitive.Number,
    power_connector: PowerConnectorSchema,
    port: PortSchema,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    width: "Width",
    length: "Length",
    height: "Height",

    pcie: "PCIe Version",
    minimum_psu: "Minimum PSU Wattage",
    power_connector: "Power Connector",
    port: "Port",
  };
}

export default GraphicCardSpec;
