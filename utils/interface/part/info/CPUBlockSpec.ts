import {
  createDTO,
  createModel,
  InternalConnectors,
  Material,
} from "../../utils";
import { z } from "zod";

export namespace CPUBlockSpec {
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
}

export default CPUBlockSpec;
