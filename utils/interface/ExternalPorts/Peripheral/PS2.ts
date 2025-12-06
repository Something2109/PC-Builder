import { z } from "zod";

export const Port = z.enum(["Keyboard", "Mouse", "Dual"]);

export type Port = z.infer<typeof Port>;

export const Regex = new RegExp(`${Port.options.join("|")} PS/2`);

export const toString = (port: Port) => `${port} PS/2` as const;

export const Schema = z.custom<ReturnType<typeof toString>>((val) =>
  typeof val === "string" ? Regex.test(val) : false
);
