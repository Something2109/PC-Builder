import { z } from "zod";

import { FormFactor, InternalConnectors, Primitive } from "../../interface";
import { LengthUnits } from "../../Units";
import { createDTO, createModel, createUnit, createSuffix } from "../../utils";

export const Bearing = z.enum(["Fluid dynamic", "Ball", "Sleeve", "Rifle"]);

export type Bearing = z.infer<typeof Bearing>;

const Info = z.object({
  form_factor: FormFactor.Fan,

  width: createUnit(LengthUnits, "mm"),
  length: createUnit(LengthUnits, "mm"),
  height: createUnit(LengthUnits, "mm"),
  count: Primitive.Number,

  voltage: createSuffix("V"),

  speed: createSuffix("RPM"),
  airflow: createSuffix("CFM"),
  noise: createSuffix("dBA"),
  static_pressure: createSuffix("mmH2O"),
  bearing: Bearing,

  connector: InternalConnectors.Fan.Connector,
  rgb: InternalConnectors.RGB,
});

export type Info = z.infer<typeof Info>;

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

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
