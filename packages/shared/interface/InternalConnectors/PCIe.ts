import { z } from "zod";

export const Controller = z.enum(["CPU", "Chipset"]);

export type Controller = z.infer<typeof Controller>;

export const Width = z.enum(["x16", "x8", "x4", "x2", "x1"]);

export type Width = z.infer<typeof Width>;

export const Regex = new RegExp(`PCIe (\\d\\.?\\d?) (${Width.options.join("|")})`);

export const toString = (version: number, width: Width) => `PCIe ${version} ${width}` as const;

export const Schema = z.custom<ReturnType<typeof toString>>((val) =>
  typeof val === "string" ? Regex.test(val) : false
);
