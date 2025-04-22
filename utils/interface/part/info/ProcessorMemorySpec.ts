import { InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

export namespace ProcessorMemory {
  export const Schema = z.object({
    type: InternalConnectors.RAM,
    capacity: Primitive.Number,
    channel_count: Primitive.Number,
    bandwidth: Primitive.Number,
    bus: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    type: "Memory Type",
    capacity: "Memory Capacity",
    channel_count: "Memory Channel",
    bandwidth: "Memory Bandwidth",
    bus: "Memory Bus",
  };
}

export default ProcessorMemory;
