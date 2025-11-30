import { z } from "zod";

export const Mainboard = z.enum([
  "Pico-ITX",
  "Mini-ITX",
  "Mini-ATX",
  "microATX",
  "ATX",
  "EATX",
]);

export type Mainboard = z.infer<typeof Mainboard>;

export const RAM = z.enum(["DIMM", "SO-DIMM", "CAMM2"]);

export type RAM = z.infer<typeof RAM>;

export const SSD = z.enum([
  "2.5",
  "U.2",
  "mSATA",
  "M.2 2230",
  "M.2 2242",
  "M.2 2280",
  "M.2 22110",
]);

export type SSD = z.infer<typeof SSD>;

export const HDD = z.enum(["2.5", "3.5"]);

export type HDD = z.infer<typeof HDD>;

export const PSU = z.enum([
  "ATX PS/2",
  "ATX PS/3",
  "SFX",
  "SFX-L",
  "TFX",
  "Flex ATX",
]);

export type PSU = z.infer<typeof PSU>;

export const Case = z.enum([
  "Mini-Tower",
  "Micro-Tower",
  "Mid-Tower",
  "Full-Tower",
]);

export type Case = z.infer<typeof Case>;

export const Fan = z.enum(["40", "80", "92", "120", "140", "180", "200"]);

export type Fan = z.infer<typeof Fan>;

export const Pump = z.enum(["D5", "DDC"]);

export type Pump = z.infer<typeof Pump>;

export const Radiator = z.enum(["120", "140", "240", "280", "360", "420"]);

export type Radiator = z.infer<typeof Radiator>;
