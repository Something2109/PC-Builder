import { ExternalPorts, Primitive } from "../utils";
import { z } from "zod";

namespace MainboardUSBConnector {
  export const Schema = z.record(ExternalPorts.USB.Schema, Primitive.Number);

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {};
}

export default MainboardUSBConnector;
