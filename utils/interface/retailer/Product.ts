import { z } from "zod";

export const RetailProductSchema = z.object({
  name: z.string(),
  price: z.number(),
  link: z.string().url(),
  img: z.string().url().nullish(),
  availability: z.boolean(),
});

export type RetailProductType = z.infer<typeof RetailProductSchema>;
