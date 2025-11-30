import { z } from "zod";

export const Side = z.enum(["Top", "Bottom", "Front", "Rear", "Side"]);

export type Side = z.infer<typeof Side>;

export const HardDrivePlace = z.enum([
  "Top",
  "Bottom",
  "Front",
  "Rear",
  "Side",
  "Drive Bay",
]);

export type HardDrivePlace = z.infer<typeof HardDrivePlace>;

export const HardDriveFormFactor = z.enum(["2.5", "3.5"]);

export type HardDriveFormFactor = z.infer<typeof HardDriveFormFactor>;
