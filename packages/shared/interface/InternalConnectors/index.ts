import { z } from "zod";

import { Schema as FanSchema } from "./Fan";
import { Schema as PCIeSchema } from "./PCIe";
import { Mainboard, GraphicCard, Miscellanous as PowerMiscellanous } from "./Power";
import { SSD, HDD } from "./Storage";

export * as Power from "./Power";

export type Power = Mainboard | GraphicCard | PowerMiscellanous;

export * as PCIe from "./PCIe";

export type PCIe = z.infer<typeof PCIeSchema>;

export const RAM = z.enum([
  "DDR1",
  "DDR2",
  "DDR3",
  "LPDDR3",
  "DDR4",
  "LPDDR4",
  "DDR5",
]);

export type RAM = z.infer<typeof RAM>;

export const SGRAM = z.enum([
  "DDR SGRAM",
  "GDDR2",
  "GDDR3",
  "GDDR4",
  "GDDR5",
  "GDDR5X",
  "GDDR6",
  "GDDR6X",
  "GDDR6W",
  "GDDR7",
]);

export type SGRAM = z.infer<typeof SGRAM>;

export * as Storage from "./Storage";

export type Storage = SSD | HDD;

export * as Fan from "./Fan";

export type Fan = z.infer<typeof FanSchema>;

export const Sound = z.enum(["Front Panel Audio Header", "SPDIF Out Header"]);

export type Sound = z.infer<typeof Sound>;

export const RGB = z.enum(["4 pin 12V RGB", "3 pin 5V Addressable RGB"]);

export type RGB = z.infer<typeof RGB>;

export const Miscellanous = z.enum([
  "Front Panel Header",
  "Serial COM Port Header",
  "Parallel LPT Port Header",
  "Chassis Intrusion Header",
  "Thunderbolt Header",
  "Temperature Sensor Header",
  "TPM Header",
]);

export type Miscellanous = z.infer<typeof Miscellanous>;
