import { FormFactor } from "../utils";
import { z } from "zod";

export namespace CasePSUSupport {
  export const Schema = z.object({
    psu_support: FormFactor.PSU,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    psu_support: "PSU Support",
  };
}

export default CasePSUSupport;
