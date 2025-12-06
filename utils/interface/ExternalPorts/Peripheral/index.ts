import { z } from "zod";

export const Type = z.enum(["USB", "PS/2"]);

export type Type = z.infer<typeof Type>;

export * as USB from "./USB";

export type USB = z.infer<typeof USB.Schema>;

export * as PS2 from "./PS2";

export type PS2 = z.infer<typeof PS2.Schema>;

export const Schema = z.union([USB.Schema, PS2.Schema]);
