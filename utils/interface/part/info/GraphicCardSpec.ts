import {
  createDTO,
  createModel,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

const Info = z.object({
  width: Primitive.Number,
  length: Primitive.Number,
  height: Primitive.Number,

  pcie: Primitive.Number,
  minimum_psu: Primitive.Number,

  power_connector: InternalConnectors.Power.GraphicCard,
  power_connector_count: Primitive.Number,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  width: "Width",
  length: "Length",
  height: "Height",

  pcie: "PCIe Version",
  minimum_psu: "Minimum PSU Wattage",

  power_connector: "Power Connector",
  power_connector_count: "Power Connector Count",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
