import { z } from "zod";

export const Metal = z.enum([
  "Alluminium",
  "Brass",
  "Copper",
  "Inox",
  "Nickel-Plated Copper",
  "Nickel",
  "Stainless Steel",
]);

export type Metal = z.infer<typeof Metal>;

export const Plastic = z.enum(["Acetal", "Acrylic", "Nylon", "Plexi", "PPS-GF40"]);

export type Plastic = z.infer<typeof Plastic>;
