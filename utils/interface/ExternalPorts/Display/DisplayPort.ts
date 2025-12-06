import { z } from "zod";

export const Version = z.enum([
  "1.0",
  "1.1",
  "1.1a",
  "1.2",
  "1.2a",
  "1.3",
  "1.4",
  "1.4a",
  "2.0",
  "2.1",
  "2.1a",
]);

export type Version = z.infer<typeof Version>;

export const Regex = new RegExp(`DisplayPort (${Version.options.join("|")})`);

export const toString = (version: Version) => `DisplayPort ${version}` as const;

export const Schema = z.custom<ReturnType<typeof toString>>((val) =>
  typeof val === "string" ? Regex.test(val) : false
);
