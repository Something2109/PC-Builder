import { FormFactor, ExternalPorts, Primitive } from "../../utils";
import { z } from "zod";

export namespace CaseSpec {
  export const Schema = z.object({
    form_factor: FormFactor.Case,

    width: Primitive.Number,
    length: Primitive.Number,
    height: Primitive.Number,

    expansion_slot: Primitive.Number,

    max_cooler_height: Primitive.Number,
    max_psu_length: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",

    width: "Width",
    length: "Length",
    height: "Height",

    expansion_slot: "Expansion Slot",

    max_cooler_height: "Max Cooler Height",
    max_psu_length: "Max PSU Length",
  };
}

export default CaseSpec;
