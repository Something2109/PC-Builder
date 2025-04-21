import { InternalConnectors, Primitive } from "../utils";
import { z } from "zod";

namespace MainboardStorageConnector {
  export const Schema = z.record(
    InternalConnectors.Storage.Schema,
    Primitive.Number
  );

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = [
    ...InternalConnectors.Storage.SSD.options,
    ...InternalConnectors.Storage.HDD.options,
  ].reduce((acc, val) => {
    acc[val] = val;
    return acc;
  }, {} as { [key in keyof Info]: string });
}

export default MainboardStorageConnector;
