import { Case, FormFactor, Primitive } from "../utils";
import { z } from "zod";

export namespace CaseFanSupport {
  export const Schema = z.record(
    Case.Side,
    z.record(FormFactor.Fan, Primitive.Number)
  );

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    top: "Top",
    bottom: "Bottom",
    front: "Front",
    rear: "Rear",
    side: "Side",
  };
}

export default CaseFanSupport;
