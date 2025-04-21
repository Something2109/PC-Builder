import { InternalConnectors, Material } from "../utils";
import { z } from "zod";

export namespace CPUBlockSpec {
  export const Schema = z.object({
    plate: Material.Metal,
    rgb: InternalConnectors.RGB,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    plate: "Plate",
    rgb: "RGB",
  };
}

export default CPUBlockSpec;
