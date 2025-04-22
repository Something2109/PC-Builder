import { FormFactor, Material, FilterOptions, Primitive } from "../../utils";
import { z } from "zod";

export namespace RadiatorSpec {
  export const Schema = z.object({
    form_factor: FormFactor.Radiator,

    width: Primitive.Number,
    length: Primitive.Number,
    height: Primitive.Number,

    fpi: Primitive.Number,
    material: Material.Metal,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",

    width: "Width",
    length: "Length",
    height: "Height",

    fpi: "FPI",
    material: "Material",
  };
}

export default RadiatorSpec;
