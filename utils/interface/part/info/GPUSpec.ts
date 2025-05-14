import { Primitive } from "../../utils";
import { z } from "zod";

namespace GPUSpec {
  export const Schema = z.object({
    family: Primitive.String,

    core_count: Primitive.Number,
    rops: Primitive.Number,
    tmus: Primitive.Number,
    execution_unit: Primitive.Number,
    ray_tracing: Primitive.Number,
    tensor: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    family: "Family",

    core_count: "Core Count",
    rops: "ROPs",
    tmus: "TMUs",
    execution_unit: "Execution Unit",
    ray_tracing: "Ray Tracing Cores",
    tensor: "Tensor Cores",
  };
}

export default GPUSpec;
