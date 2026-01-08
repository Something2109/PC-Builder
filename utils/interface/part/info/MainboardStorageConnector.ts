import {
  createDTO,
  createModel,
  InternalConnectors,
  Primitive,
} from "../../utils";
import { z } from "zod";

namespace MainboardStorageConnector {
  const Info = z.object({
    form_factor: InternalConnectors.Storage.Schema,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Info>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",
    count: "Count",
  };

  const Required = ["form_factor"] as const;

  const Model = createModel(Info, [...Required]);

  export type Model = z.infer<typeof Model>;

  const DTO = createDTO(Info, [...Required]);

  export type DTO = z.infer<typeof DTO>;

  export const Schemas = { Info, Model, DTO };
}

export default MainboardStorageConnector;
