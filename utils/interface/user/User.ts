import { z } from "zod";
import { Primitive } from "../utils";
import { Roles } from "@/utils/Enum";

export const LogInOptions = z.object({
  username: Primitive.String.min(8),
  password: Primitive.String.min(8),
});

export type LogInOptions = z.infer<typeof LogInOptions>;

export const Information = z.object({
  name: Primitive.String.nullable(),
  email: Primitive.String.email().nullable(),
  role: z.nativeEnum(Roles),
});

export type Information = z.infer<typeof Information>;

export const Schema = z
  .object({ id: Primitive.String.uuid() })
  .extend(LogInOptions.shape)
  .extend(Information.shape);

export type Type = z.infer<typeof Schema>;

export const Summary = Schema.pick({
  id: true,
  username: true,
  name: true,
  role: true,
});

export type Summary = z.infer<typeof Summary>;

export const Detail = Schema.omit({ password: true });

export type Detail = z.infer<typeof Detail>;

export const FilterOptions = z
  .object({ role: z.array(z.nativeEnum(Roles)) })
  .partial();

export type FilterOptions = z.infer<typeof FilterOptions>;

export const JwtPayload = Schema.pick({
  id: true,
  username: true,
  role: true,
});

export type JwtPayload = z.infer<typeof JwtPayload>;
