import { InternalConnectors, Primitive } from "../utils";
import { z } from "zod";

namespace MainboardPCIe {
  export const Schema = z.record(
    InternalConnectors.PCIe.Controller,
    z.record(InternalConnectors.PCIe.Schema, Primitive.Number)
  );

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    cpu: "CPU",
    chipset: "Chipset",
  };
}

export default MainboardPCIe;
