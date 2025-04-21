import { FormFactor } from "../utils";
import { z } from "zod";

export namespace CaseMainboardSupport {
  export const Schema = z.object({
    form_factor: FormFactor.Mainboard,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Mainboard Support",
  };
}

export default CaseMainboardSupport;
