import { z } from "zod";

export const Type = z.enum(["Button"]);

export type Type = z.infer<typeof Type>;

export const Button = z.enum([
  "Power Button",
  "Reset Button",
  "Clear CMOS Button",
  "Flash BIOS Button",
]);

export type Button = z.infer<typeof Button>;

export const Schema = Button;
