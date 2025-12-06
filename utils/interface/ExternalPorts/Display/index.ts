import { z } from "zod";

export const Type = z.enum(["HDMI", "DisplayPort", "DVI", "VGA"]);

export type Type = z.infer<typeof Type>;

export * as HDMI from "./HDMI";

export type HDMI = z.infer<typeof HDMI.Schema>;

export * as DisplayPort from "./DisplayPort";

export type DisplayPort = z.infer<typeof DisplayPort.Schema>;

export const DVI = z.enum(["DVI-D", "DVI-I", "DVI-A", "Mini-DVI", "Micro-DVI"]);

export type DVI = z.infer<typeof DVI>;

export const VGA = z.enum(["VGA", "Mini-VGA"]);

export type VGA = z.infer<typeof VGA>;

export const Schema = z.union([HDMI.Schema, DisplayPort.Schema, DVI, VGA]);
