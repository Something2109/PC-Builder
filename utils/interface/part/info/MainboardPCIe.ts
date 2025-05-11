import { InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

namespace MainboardPCIe {
  export const Schema = z.object({
    controller: InternalConnectors.PCIe.Controller,
    version: Primitive.Number,
    width: InternalConnectors.PCIe.Width,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    controller: "Controller",
    version: "Version",
    width: "Lane Width",
    count: "Count",
  };
}

export default MainboardPCIe;
