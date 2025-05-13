import { ExternalPorts, Primitive } from "../../utils";
import { z } from "zod";

export namespace DisplayExternalPorts {
  export const Schema = z.object({
    type: ExternalPorts.Display.Type,
    name: ExternalPorts.Display.Schema,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    type: "Type",
    name: "Name",
    count: "Count",
  };
}

export default DisplayExternalPorts;
