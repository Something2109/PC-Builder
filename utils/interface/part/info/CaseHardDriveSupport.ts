import { Case, Primitive } from "../../utils";
import { z } from "zod";

export namespace CaseHardDriveSupport {
  export const Schema = z.object({
    place: Case.HardDrivePlace,
    form_factor: Case.HardDriveFormFactor,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    place: "Drive Place",
    form_factor: "Form Factor",
    count: "Drive Count",
  };
}

export default CaseHardDriveSupport;
