import { FilterOptions, FormFactor, InternalConnectors } from "../utils";
import { z } from "zod";

namespace Fan {
  export const Bearing = z.enum(["Fluid dynamic", "Ball", "Sleeve", "Rifle"]);

  export type Bearing = z.infer<typeof Bearing>;

  export const Schema = z.object({
    form_factor: FormFactor.Fan,

    width: z.number(),
    length: z.number(),
    height: z.number(),
    count: z.number(),

    voltage: z.number(),

    speed: z.number(),
    airflow: z.number(),
    noise: z.number(),
    static_pressure: z.number(),
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

  export const SummarySchema = Schema.pick({
    form_factor: true,
    bearing: true,
    speed: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      form_factor: FilterOptions(FormFactor.Fan),
      bearing: FilterOptions(Bearing),
    })
    .partial();

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FormFactor.Fan.options,
    bearing: Bearing.options,
  };

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default Fan;
