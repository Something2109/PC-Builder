import { createDTO, createModel, Primitive } from "../../utils";
import { z } from "zod";

export namespace CPUSpec {
  const Info = z.object({
    family: Primitive.String,

    socket: Primitive.String,
    total_cores: Primitive.Number,
    total_threads: Primitive.Number,

    lithography: Primitive.String,
  });

  export type Info = z.infer<typeof Info>;

  export const Label: { [key in keyof Info]: string } = {
    family: "Family",

    socket: "Socket",
    total_cores: "Total Cores",
    total_threads: "Total Threads",

    lithography: "Lithography",
  };

  const Model = createModel(Info);

  export type Model = z.infer<typeof Model>;

  const DTO = createDTO(Info);

  export type DTO = z.infer<typeof DTO>;

  export const Schemas = { Info, Model, DTO };
}

export default CPUSpec;
