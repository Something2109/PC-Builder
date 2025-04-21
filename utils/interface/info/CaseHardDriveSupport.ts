import { Case, Primitive } from "../utils";
import { z } from "zod";

export namespace CaseHardDriveSupport {
  export const Schema = z.record(
    Case.HardDrivePlace,
    z.record(Case.HardDriveFormFactor, Primitive.Number)
  );

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    top: "Top",
    bottom: "Bottom",
    front: "Front",
    rear: "Rear",
    side: "Side",
    drive_bay: "Drive Bay",
  };
}

export default CaseHardDriveSupport;
