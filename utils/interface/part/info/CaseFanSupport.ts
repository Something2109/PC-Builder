import { Case, FormFactor, Primitive } from "../../utils";
import { z } from "zod";

export namespace CaseFanSupport {
  export const Schema = z.object({
    case_side: Case.Side,
    form_factor: FormFactor.Fan,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    case_side: "Case Side",
    form_factor: "Form Factor",
    count: "Fan Count",
  };
}

export default CaseFanSupport;
