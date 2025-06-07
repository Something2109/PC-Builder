import {
  createDTO,
  createModel,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

namespace MainboardPCIe {
  const Info = z.object({
    controller: InternalConnectors.PCIe.Controller,
    version: Primitive.Number,
    width: InternalConnectors.PCIe.Width,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Info>;

  export const Label: { [key in keyof Info]: string } = {
    controller: "Controller",
    version: "Version",
    width: "Lane Width",
    count: "Count",
  };

  const Required = ["controller", "version", "width"] as const;

  const Model = createModel(Info, [...Required]);

  export type Model = z.infer<typeof Model>;

  const DTO = createDTO(Info, [...Required]);

  export type DTO = z.infer<typeof DTO>;

  export const Schemas = { Info, Model, DTO };
}

export default MainboardPCIe;
