import { z } from "zod";

import { Network, Peripheral, Display, Audio, Interaction } from "./ExternalPorts";

export const Primitive = {
  String: z.string(),

  Number: z.coerce.number().refine((val) => val >= 0),
};

export const UUID = z.uuid();

export const isUUID = (val: unknown): val is string =>
  typeof val === "string" && UUID.safeParse(val).success;

export * as FormFactor from "./FormFactor";

export * as InternalConnectors from "./InternalConnectors";

export * as ExternalPorts from "./ExternalPorts";

export type ExternalPorts = Network | Peripheral | Display | Audio | Interaction;

export * as Material from "./Material";

export * as Case from "./Case";
