import { z } from "zod";
import { Primitive } from "../utils";
import { Roles } from "@/utils/Enum";

namespace User {
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

  export const FilterOptions = z
    .object({
      role: z.array(z.nativeEnum(Roles)),
    })
    .partial();

  export type FilterOptions = z.infer<typeof FilterOptions>;
}

export { User };
