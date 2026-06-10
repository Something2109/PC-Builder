import { z } from "zod";

import { Schema as AudioSchema } from "./Audio";
import { HDAudio, SPDIF } from "./Audio";
import { Schema as DisplaySchema } from "./Display";
import { HDMI, DisplayPort, DVI, VGA } from "./Display";
import { Schema as InteractionSchema } from "./Interaction";
import { Button } from "./Interaction";
import { Schema as NetworkSchema } from "./Network";
import { Ethernet } from "./Network";
import { Schema as PeripheralSchema } from "./Peripheral";
import { USB, PS2 } from "./Peripheral";

export const Type = z.enum([
  "Network",
  "Peripheral",
  "Display",
  "Audio",
  "Interaction",
]);

export type Type = z.infer<typeof Type>;

export * as Network from "./Network";

export type Network = Ethernet;

export * as Peripheral from "./Peripheral";

export type Peripheral = USB | PS2;

export * as Display from "./Display";

export type Display =
  | HDMI
  | DisplayPort
  | DVI
  | VGA;

export * as Audio from "./Audio";

export type Audio = HDAudio | SPDIF;

export * as Interaction from "./Interaction";

export type Interaction = Button;

export const Schema = z.union([
  NetworkSchema,
  PeripheralSchema,
  DisplaySchema,
  AudioSchema,
  InteractionSchema,
]);
