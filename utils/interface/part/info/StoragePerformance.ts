import { FormFactor, InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

namespace StoragePerformance {
  export const Schema = z.object({
    read_speed: Primitive.Number,
    write_speed: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    read_speed: "Read Speed",
    write_speed: "Write Speed",
  };
}

export default StoragePerformance;
