import { ExternalPorts, Primitive } from "../../utils";
import { z } from "zod";

export namespace PartExternalPorts {
  export const Schema = z.object({
    type: ExternalPorts.Type,
    name: ExternalPorts.Schema,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    type: "Type",
    name: "Name",
    count: "Count",
  };
}

export default PartExternalPorts;
