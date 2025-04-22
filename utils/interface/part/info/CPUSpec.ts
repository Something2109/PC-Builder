import { Primitive } from "../../utils";
import { z } from "zod";

export namespace CPUSpec {
  export const Schema = z.object({
    family: Primitive.String,

    socket: Primitive.String,
    total_cores: Primitive.Number,
    total_threads: Primitive.Number,

    lithography: Primitive.String,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    family: "Family",

    socket: "Socket",
    total_cores: "Total Cores",
    total_threads: "Total Threads",

    lithography: "Lithography",
  };
}

export default CPUSpec;
