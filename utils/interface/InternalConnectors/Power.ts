import { z } from "zod";

export const Mainboard = z.enum([
  "ATX Main 20 pin",
  "ATX Main 20 + 4 pin",
  "ATX 12V 4 pin",
  "ATX 12V 4 + 4 pin",
  "PCIe 6 pin",
  "PCIe 6 + 2 pin",
]);

export type Mainboard = z.infer<typeof Mainboard>;

export const GraphicCard = z.enum(["PCIe 6 pin", "PCIe 6 + 2 pin", "12VHPWR"]);

export type GraphicCard = z.infer<typeof GraphicCard>;

export const Miscellanous = z.enum([
  "SATA",
  "Molex 4 pin",
  "Floppy Disk 4 pin",
]);

export type Miscellanous = z.infer<typeof Miscellanous>;

export const Options = [
  ...new Set([
    ...Mainboard.options,
    ...GraphicCard.options,
    ...Miscellanous.options,
  ]).values(),
];

export const Schema = z.union([Mainboard, GraphicCard, Miscellanous]);
