import { z } from "zod";

import { ExternalPorts, Primitive } from "../../interface";
import { createDTO, createModel } from "../../utils";

const Info = z.object({
  generation: ExternalPorts.Peripheral.USB.Generation,
  connector: ExternalPorts.Peripheral.USB.Connector,
  count: Primitive.Number,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  generation: "Generation",
  connector: "Connector",
  count: "Count",
};

const Required = ["generation", "connector"] as const;

const Model = createModel(Info, [...Required]);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info, [...Required]);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
