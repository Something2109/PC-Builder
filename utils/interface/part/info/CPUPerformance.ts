import { Primitive } from "../../utils";
import { z } from "zod";

export namespace CPUPerformance {
  export const Schema = z.object({
    base_frequency: Primitive.Number,
    turbo_frequency: Primitive.Number,

    tdp: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    base_frequency: "Base Frequency",
    turbo_frequency: "Turbo Frequency",

    tdp: "TDP",
  };
}

export default CPUPerformance;
