import { z } from "zod";

import { FormFactor, InternalConnectors, Primitive } from "../../interface";
import { LengthUnits, VolumeSpeedUnit } from "../../Units";
import { createDTO, createModel, createUnit } from "../../utils";

const Info = z.object({
  form_factor: FormFactor.Pump,

  width: createUnit(LengthUnits, "mm"),
  length: createUnit(LengthUnits, "mm"),
  height: createUnit(LengthUnits, "mm"),

  voltage: Primitive.Number,
  wattage: Primitive.Number,
  head_pressure: Primitive.Number,
  flow_rate: createUnit(VolumeSpeedUnit, "L/h"),

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
