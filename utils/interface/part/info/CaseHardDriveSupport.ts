import { Case, createDTO, createModel, Primitive } from "../../utils";
import { z } from "zod";

export namespace CaseHardDriveSupport {
  const Info = z.object({
    place: Case.HardDrivePlace,
    form_factor: Case.HardDriveFormFactor,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Info>;

  export const Label: { [key in keyof Info]: string } = {
    place: "Drive Place",
    form_factor: "Form Factor",
    count: "Drive Count",
  };

  const Required = ["place", "form_factor"] as const;

  const Model = createModel(Info, [...Required]);

  export type Model = z.infer<typeof Model>;

  const DTO = createDTO(Info, [...Required]);

  export type DTO = z.infer<typeof DTO>;

  export const Schemas = { Info, Model, DTO };
}

export default CaseHardDriveSupport;
