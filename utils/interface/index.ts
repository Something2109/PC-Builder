import { z } from "zod";

export const Primitive = {
  String: z.string(),

  Number: z.coerce.number().refine((val) => val >= 0),
};

export * as FormFactor from "./FormFactor";

export * as InternalConnectors from "./InternalConnectors";

export * as ExternalPorts from "./ExternalPorts";

export * as Material from "./Material";

export * as Case from "./Case";
