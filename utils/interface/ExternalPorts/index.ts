import { z } from "zod";

export const Type = z.enum([
  "Network",
  "Peripheral",
  "Display",
  "Audio",
  "Interaction",
]);

export type Type = z.infer<typeof Type>;

export * as Network from "./Network";

export type Network = Network.Ethernet;

export * as Peripheral from "./Peripheral";

export type Peripheral = Peripheral.USB | Peripheral.PS2;

export * as Display from "./Display";

export type Display =
  | Display.HDMI
  | Display.DisplayPort
  | Display.DVI
  | Display.VGA;

export * as Audio from "./Audio";

export type Audio = Audio.HDAudio | Audio.SPDIF;

export * as Interaction from "./Interaction";

export type Interaction = Interaction.Button;

export const Schema = z.union([
  Network.Schema,
  Peripheral.Schema,
  Display.Schema,
  Audio.Schema,
  Interaction.Schema,
]);
