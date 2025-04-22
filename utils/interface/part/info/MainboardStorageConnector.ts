import { InternalConnectors, Primitive } from "../../utils";
import { z } from "zod";

namespace MainboardStorageConnector {
  export const Schema = z.object({
    form_factor: InternalConnectors.Storage.Schema,
    count: Primitive.Number,
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    form_factor: "Form Factor",
    count: "Count",
  };
}

export default MainboardStorageConnector;
