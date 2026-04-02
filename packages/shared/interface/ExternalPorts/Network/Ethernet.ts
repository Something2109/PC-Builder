import { z } from "zod";

export const Speed = z.enum(["10/100", "1G", "2.5G", "5G", "10G"]);

export type Speed = z.infer<typeof Speed>;

export const Interface = z.enum(["RJ45", "SFP", "SFP+", "QSFP", "QSFP+"]);

export type Interface = z.infer<typeof Interface>;

export const Regex = new RegExp(
  `(${Speed.options.join("|")}) (${Interface.options.join("|")}) LAN Ethernet`
);

export const toString = (speed: Speed, inter: Interface) =>
  `${speed} ${inter} LAN Ethernet` as const;

export const Schema = z.custom<ReturnType<typeof toString>>((val) =>
  typeof val === "string" ? Regex.test(val) : false
);
