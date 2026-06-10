import { z } from "zod";

import { Schema as PS2Schema } from "./PS2";
import { Schema as USBSchema } from "./USB";

export const Type = z.enum(["USB", "PS/2"]);

export type Type = z.infer<typeof Type>;

export * as USB from "./USB";

export type USB = z.infer<typeof USBSchema>;

export * as PS2 from "./PS2";

export type PS2 = z.infer<typeof PS2Schema>;

export const Schema = z.union([USBSchema, PS2Schema]);
