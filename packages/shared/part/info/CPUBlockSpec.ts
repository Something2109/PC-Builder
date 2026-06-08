import { z } from "zod";

import { InternalConnectors, Material } from "../../interface";
import { createDTO, createModel } from "../../utils";

const Info = z.object({
  plate: Material.Metal,
  rgb: InternalConnectors.RGB,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  plate: "Plate",
  rgb: "RGB",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
