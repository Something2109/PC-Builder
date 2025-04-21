import { Primitive } from "../utils";
import { z } from "zod";

export namespace CPUBlockSocketSupport {
  export const Schema = z.object({
    socket: z.array(Primitive.String),
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    socket: "Socket",
  };
}

export default CPUBlockSocketSupport;
