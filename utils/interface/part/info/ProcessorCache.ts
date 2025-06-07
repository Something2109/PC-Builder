import { createDTO, createModel, Primitive } from "../../utils";
import { z } from "zod";

export namespace ProcessorCache {
  const Info = z.object({
    L1_cache: Primitive.Number,
    L2_cache: Primitive.Number,
    L3_cache: Primitive.Number,
  });

  export type Info = z.infer<typeof Info>;

  export const Label: { [key in keyof Info]: string } = {
    L1_cache: "L1 Cache",
    L2_cache: "L2 Cache",
    L3_cache: "L3 Cache",
  };

  const Model = createModel(Info);

  export type Model = z.infer<typeof Model>;

  const DTO = createDTO(Info);

  export type DTO = z.infer<typeof DTO>;

  export const Schemas = { Info, Model, DTO };
}

export default ProcessorCache;
