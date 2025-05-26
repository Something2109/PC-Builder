import { ExternalPorts, Primitive } from "../../utils";
import { z } from "zod";

namespace MainboardUSBConnector {
  export const Schema = z.object({
    generation: ExternalPorts.Peripheral.USB.Generation,
    connector: ExternalPorts.Peripheral.USB.Connector,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    generation: "Generation",
    connector: "Connector",
    count: "Count",
  };
}

export default MainboardUSBConnector;
