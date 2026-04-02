import { Primitive } from "../interface";
import { z } from "zod";

export const RetailProductSchema = z.object({
  name: Primitive.String,
  price: Primitive.Number,
  link: Primitive.String.url(),
  img: Primitive.String.url().nullish(),
  availability: z.boolean(),
});

export type RetailProductType = z.infer<typeof RetailProductSchema>;
