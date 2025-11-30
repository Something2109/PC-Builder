import {
  createDTO,
  createModel,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

const Info = z.object({
  type: InternalConnectors.Fan.Type,
  connector: InternalConnectors.Fan.Connector,
  count: Primitive.Number,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  type: "Type",
  connector: "Connector",
  count: "Count",
};

const Required = ["type", "connector"] as const;

const Model = createModel(Info, [...Required]);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info, [...Required]);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
