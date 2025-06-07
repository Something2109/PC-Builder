import {
  createDTO,
  createModel,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

namespace MainboardPowerConnector {
  const Info = z.object({
    type: InternalConnectors.Power.Mainboard,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Info>;

  export const Label: { [key in keyof Info]: string } = {
    type: "Type",
    count: "Count",
  };

  const Required = ["type"] as const;

  const Model = createModel(Info, [...Required]);

  export type Model = z.infer<typeof Model>;

  const DTO = createDTO(Info, [...Required]);

  export type DTO = z.infer<typeof DTO>;

  export const Schemas = { Info, Model, DTO };
}

export default MainboardPowerConnector;
