import { z } from "zod";
import { Schema as HDAudioSchema } from "./HDAudio";
import { Schema as SPDIFSchema } from "./SPDIF";

export const Type = z.enum(["HD Audio", "SPDIF"]);

export type Type = z.infer<typeof Type>;

export * as HDAudio from "./HDAudio";

export type HDAudio = z.infer<typeof HDAudio.Schema>;

export * as SPDIF from "./SPDIF";

export type SPDIF = z.infer<typeof SPDIF.Schema>;

export const Schema = z.union([HDAudioSchema, SPDIFSchema]);
