import { FormFactor, Primitive } from "../../utils";
import { z } from "zod";

export namespace PSUSpec {
  export const Modular = z.enum([
    "Non-Modular",
    "Semi-Modular",
    "Full-Modular",
  ]);

  export type Modular = z.infer<typeof Modular>;

  export const Efficiency = z.enum([
    "None",
    "80 Plus",
    "80 PLUS Bronze",
    "80 PLUS Silver",
    "80 PLUS Gold",
    "80 PLUS Platinum",
    "80 PLUS Titanium",
  ]);

  export type Efficiency = z.infer<typeof Efficiency>;

  export const Schema = z.object({
    wattage: Primitive.Number,
    efficiency: Efficiency,

    form_factor: FormFactor.PSU,
    width: Primitive.Number,
    length: Primitive.Number,
    height: Primitive.Number,
    modular: Modular,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    wattage: "Wattage",
    efficiency: "Efficiency",

    form_factor: "Form Factor",
    width: "Width",
    length: "Length",
    height: "Height",
    modular: "Modular Type",
  };
}

export default PSUSpec;
