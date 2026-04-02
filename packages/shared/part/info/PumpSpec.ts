import { FormFactor, InternalConnectors, Primitive } from "../../interface";
import { createDTO, createModel } from "../../utils";
import { z } from "zod";

const Info = z.object({
  form_factor: FormFactor.Pump,

  width: Primitive.Number,
  length: Primitive.Number,
  height: Primitive.Number,

  voltage: Primitive.Number,
  wattage: Primitive.Number,
  head_pressure: Primitive.Number,
  flow_rate: Primitive.Number,

  power_connector: InternalConnectors.Power.Miscellanous,
  control_connector: InternalConnectors.Fan.Connector,
  rgb: InternalConnectors.RGB,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  form_factor: "Form Factor",

  width: "Width",
  length: "Length",
  height: "Height",

  voltage: "Voltage",
  wattage: "Wattage",
  head_pressure: "Head Pressure",
  flow_rate: "Flow Rate",

  power_connector: "Power Connector",
  control_connector: "Control Connector",
  rgb: "RGB",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
