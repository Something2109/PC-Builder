import { z } from "zod";

import { InternalConnectors, Primitive } from "../../interface";
import { createDTO, createModel } from "../../utils";

const Info = z.object({
  type: InternalConnectors.SGRAM,
  speed: Primitive.Number,
  capacity: Primitive.Number,
  bandwidth: Primitive.Number,
  bus_width: Primitive.Number,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  type: "Memory Type",
  speed: "Memory Speed",
  capacity: "Memory Capacity",
  bandwidth: "Memory Bandwidth",
  bus_width: "Memory Bus",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
