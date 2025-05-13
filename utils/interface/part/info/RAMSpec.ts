import { FormFactor, InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

namespace RAMSpec {
  export const Schema = z.object({
    speed: Primitive.Number,
    capacity: Primitive.Number,
    voltage: Primitive.Number,
    latency: z.array(Primitive.Number),
    kit: Primitive.Number,

    form_factor: FormFactor.RAM,
    interface: InternalConnectors.RAM,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    speed: "Speed",
    capacity: "Capacity",
    voltage: "Voltage",
    latency: "Latency",
    kit: "Kit",

    form_factor: "Form Factor",
    interface: "Interface",
  };
}

export default RAMSpec;
