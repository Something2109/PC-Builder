import { Primitive } from "../../utils";
import { z } from "zod";

export namespace CPUBlockSocketSupport {
  export const Schema = z.object({
    socket: Primitive.String,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    socket: "Socket Support",
  };
}

export default CPUBlockSocketSupport;
