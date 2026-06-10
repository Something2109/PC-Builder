import { z } from "zod";

import { Schema as HDAudioSchema } from "./HDAudio";
import { Schema as SPDIFSchema } from "./SPDIF";

export const Type = z.enum(["HD Audio", "SPDIF"]);

export type Type = z.infer<typeof Type>;

export * as HDAudio from "./HDAudio";

export type HDAudio = z.infer<typeof HDAudioSchema>;

export * as SPDIF from "./SPDIF";

export type SPDIF = z.infer<typeof SPDIFSchema>;

export const Schema = z.union([HDAudioSchema, SPDIFSchema]);
