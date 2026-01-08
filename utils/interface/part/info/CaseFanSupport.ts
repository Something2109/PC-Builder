import {
  Case,
  createDTO,
  createModel,
  FormFactor,
  Primitive,
} from "../../utils";
import { z } from "zod";

export namespace CaseFanSupport {
  const Info = z.object({
    case_side: Case.Side,
    form_factor: FormFactor.Fan,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Info>;

  export const Label: { [key in keyof Info]: string } = {
    case_side: "Case Side",
    form_factor: "Form Factor",
    count: "Fan Count",
  };

  const Required = ["case_side", "form_factor"] as const;

  const Model = createModel(Info, [...Required]);

  export type Model = z.infer<typeof Model>;

  const DTO = createDTO(Info, [...Required]);

  export type DTO = z.infer<typeof DTO>;

  export const Schemas = { Info, Model, DTO };
}

export default CaseFanSupport;
