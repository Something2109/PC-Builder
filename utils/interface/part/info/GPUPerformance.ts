import { createDTO, createModel, Primitive } from "../../utils";
import { z } from "zod";

namespace GPUPerformance {
  const Info = z.object({
    base_frequency: Primitive.Number,
    boost_frequency: Primitive.Number,

    tdp: Primitive.Number,
  });

  export type Info = z.infer<typeof Info>;

  export const Label: { [key in keyof Info]: string } = {
    base_frequency: "Base Frequency",
    boost_frequency: "Boost Frequency",

    tdp: "TDP",
  };

  const Model = createModel(Info);

  export type Model = z.infer<typeof Model>;

  const DTO = createDTO(Info);

  export type DTO = z.infer<typeof DTO>;

  export const Schemas = { Info, Model, DTO };
}

export default GPUPerformance;
