import { FormFactor, InternalConnectors, Primitive } from "../utils";
import { z } from "zod";

namespace StorageCache {
  export const Schema = z.object({
    type: InternalConnectors.RAM,
    capacity: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    type: "Cache Memory Type",
    capacity: "Cache Capacity",
  };
}

export default StorageCache;
