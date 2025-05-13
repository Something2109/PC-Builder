import { InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

namespace MainboardFanConnector {
  export const Schema = z.object({
    type: InternalConnectors.Fan.Type,
    connector: InternalConnectors.Fan.Connector,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    type: "Type",
    connector: "Connector",
    count: "Count",
  };
}

export default MainboardFanConnector;
