import { FilterOptions, NumberFilterOptions, Primitive } from "../utils";
import { z } from "zod";

namespace GPUPerformance {
  export const Schema = z.object({
    base_frequency: Primitive.Number,
    boost_frequency: Primitive.Number,

    tdp: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    base_frequency: "Base Frequency",
    boost_frequency: "Boost Frequency",

    tdp: "TDP",
  };
}

export default GPUPerformance;
