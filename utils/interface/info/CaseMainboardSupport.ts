import { FormFactor } from "../utils";
import { z } from "zod";

export namespace CaseMainboardSupport {
  export const Schema = z.object({
    mainboard_support: z.array(FormFactor.Mainboard),
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    mainboard_support: "Mainboard Support",
  };
}

export default CaseMainboardSupport;
