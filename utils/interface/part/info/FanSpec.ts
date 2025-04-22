import { FormFactor, InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

namespace FanSpec {
  export const Bearing = z.enum(["Fluid dynamic", "Ball", "Sleeve", "Rifle"]);

  export type Bearing = z.infer<typeof Bearing>;

  export const Schema = z.object({
    form_factor: FormFactor.Fan,

    width: Primitive.Number,
    length: Primitive.Number,
    height: Primitive.Number,
    count: Primitive.Number,

    voltage: Primitive.Number,

    speed: Primitive.Number,
    airflow: Primitive.Number,
    noise: Primitive.Number,
    static_pressure: Primitive.Number,
    bearing: Bearing,

    connector: InternalConnectors.Fan.Connector,
    rgb: InternalConnectors.RGB,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",

    width: "Width",
    length: "Length",
    height: "Height",
    count: "Count",

    voltage: "Voltage",

    speed: "Speed",
    airflow: "Airflow",
    noise: "Noise",
    static_pressure: "Static Pressure",
    bearing: "Bearing",

    connector: "Power Connector",
    rgb: "RGB",
  };
}

export default FanSpec;
