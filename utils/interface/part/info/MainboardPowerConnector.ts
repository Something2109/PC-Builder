import { InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

namespace MainboardPowerConnector {
  export const Schema = z.object({
    type: InternalConnectors.Power.Mainboard,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    type: "Type",
    count: "Count",
  };
}

export default MainboardPowerConnector;
