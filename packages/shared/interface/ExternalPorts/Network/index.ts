import { z } from "zod";

import { Schema as EthernetSchema } from "./Ethernet";

export const Type = z.enum(["LAN Ethernet"]);

export type Type = z.infer<typeof Type>;

export * as Ethernet from "./Ethernet";

export type Ethernet = z.infer<typeof Ethernet.Schema>;

export const Schema = EthernetSchema;
