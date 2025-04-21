import { Primitive } from "../utils";
import { z } from "zod";

export namespace CPUCoreConfig {
  export const Schema = z.object({
    name: Primitive.String,
    count: Primitive.Number,

    base_frequency: Primitive.Number,
    turbo_frequency: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    name: "Core Name",
    count: "Count",

    base_frequency: "Base Frequency",
    turbo_frequency: "Turbo Frequency",
  };
}

export default CPUCoreConfig;
