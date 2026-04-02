import { z } from "zod";

export * as Power from "./Power";

export type Power = Power.Mainboard | Power.GraphicCard | Power.Miscellanous;

export * as PCIe from "./PCIe";

export type PCIe = z.infer<typeof PCIe.Schema>;

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

export type Storage = Storage.SSD | Storage.HDD;

export * as Fan from "./Fan";

export type Fan = z.infer<typeof Fan.Schema>;

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
