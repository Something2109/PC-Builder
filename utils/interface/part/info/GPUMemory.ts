import { InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

export namespace GPUMemory {
  export const Schema = z.object({
    type: InternalConnectors.SGRAM,
    speed: Primitive.Number,
    capacity: Primitive.Number,
    bandwidth: Primitive.Number,
    bus_width: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    type: "Memory Type",
    speed: "Memory Speed",
    capacity: "Memory Capacity",
    bandwidth: "Memory Bandwidth",
    bus_width: "Memory Bus",
  };
}

export default GPUMemory;
