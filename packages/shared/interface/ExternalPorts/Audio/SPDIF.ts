import { z } from "zod";

export const Interface = z.enum(["Optical", "Coaxial"]);

export type Interface = z.infer<typeof Interface>;

export const Regex = new RegExp(`(${Interface.options.join("|")}) S/PDIF`);

export const toString = (inter: Interface) => `${inter} S/PDIF` as const;

export const Schema = z.custom<ReturnType<typeof toString>>((val) =>
  typeof val === "string" ? Regex.test(val) : false
);
