import { Case, FormFactor } from "../utils";
import { z } from "zod";

export namespace CaseRadiatorSupport {
  export const Schema = z.record(Case.Side, z.array(FormFactor.Radiator));

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    top: "Top",
    bottom: "Bottom",
    front: "Front",
    rear: "Rear",
    side: "Side",
  };
}

export default CaseRadiatorSupport;
