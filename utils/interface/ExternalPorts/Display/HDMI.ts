import { z } from "zod";

export const Version = z.enum([
  "1.0",
  "1.1",
  "1.2",
  "1.2a",
  "1.3",
  "1.3a",
  "1.4",
  "1.4a",
  "1.4b",
  "2.0",
  "2.0a",
  "2.0b",
  "2.1",
  "2.1a",
  "2.1b",
]);

export type Version = z.infer<typeof Version>;

export const Connector = z.enum([
  "Type A, Standard",
  "Type B, Dual-link",
  "Type C, Mini",
  "Type D, Micro",
  "Type E, Automotive",
]);

export type Connector = z.infer<typeof Connector>;

export const Regex = new RegExp(
  `HDMI (${Version.options.join("|")}) (${Connector.options.join("|")})`
);

export const toString = (version: Version, connector: Connector) =>
  `HDMI ${version} ${connector}` as const;

export const Schema = z.custom<ReturnType<typeof toString>>((val) =>
  typeof val === "string" ? Regex.test(val) : false
);
