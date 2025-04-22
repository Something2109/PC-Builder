import { Case, FormFactor } from "../../utils";
import { z } from "zod";

export namespace CaseRadiatorSupport {
  export const Schema = z.object({
    case_side: Case.Side,
    form_factor: FormFactor.Radiator,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    case_side: "Case Side",
    form_factor: "Radiator Support",
  };
}

export default CaseRadiatorSupport;
