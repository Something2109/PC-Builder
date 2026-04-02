import { z } from "zod";

export const Port = z.enum([
  "Line-Out/Mic-In",
  "Rear",
  "Center/Subwoofer",
  "Side",
  "Line-In",
  "Line-Out",
  "Mic-In",
]);

export type Port = z.infer<typeof Port>;

export const Regex = new RegExp(`(${Port.options.join("|")}) HD Audio Port`);

export const toString = (port: Port) => `${port} HD Audio Port` as const;

export const Schema = z.custom<ReturnType<typeof toString>>((val) =>
  typeof val === "string" ? Regex.test(val) : false
);
