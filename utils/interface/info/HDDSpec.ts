import { FormFactor, InternalConnectors, Primitive } from "../utils";
import { z } from "zod";

export namespace HDDSpec {
  export const Schema = z.object({
    rotational_speed: Primitive.Number,
    capacity: Primitive.Number,

    form_factor: FormFactor.HDD,
    interface: InternalConnectors.Storage.HDD,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    rotational_speed: "Rotational Speed",
    capacity: "Capacity",

    form_factor: "Form Factor",
    interface: "Interface",
  };
}

export default HDDSpec;
