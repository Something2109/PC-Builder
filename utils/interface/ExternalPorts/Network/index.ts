import { z } from "zod";

export const Type = z.enum(["LAN Ethernet"]);

export type Type = z.infer<typeof Type>;

export * as Ethernet from "./Ethernet";

export type Ethernet = z.infer<typeof Ethernet.Schema>;

export const Schema = Ethernet.Schema;
