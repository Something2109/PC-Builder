import { InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

export namespace CPUMemory {
  export const Schema = z.object({
    type: InternalConnectors.RAM,
    speed: Primitive.Number,
    capacity: Primitive.Number,
    channel_count: Primitive.Number,
    bandwidth: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    type: "Memory Type",
    speed: "Memory Speed",
    capacity: "Memory Capacity",
    channel_count: "Memory Channel",
    bandwidth: "Memory Bandwidth",
  };
}

export default CPUMemory;
