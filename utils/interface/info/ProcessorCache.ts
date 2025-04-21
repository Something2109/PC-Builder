import { Primitive } from "../utils";
import { z } from "zod";

export namespace ProcessorCache {
  export const Schema = z.object({
    L1_cache: Primitive.Number,
    L2_cache: Primitive.Number,
    L3_cache: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    L1_cache: "L1 Cache",
    L2_cache: "L2 Cache",
    L3_cache: "L3 Cache",
  };
}

export default ProcessorCache;
