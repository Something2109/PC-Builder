import { z } from "zod";

export const Generation = z.enum(["1.0", "2.0", "3.0", "3.1", "3.2", "4"]);

export type Generation = z.infer<typeof Generation>;

export const Connector = z.enum(["Type-A", "Type-B", "Micro-A", "Micro-AB", "Micro-B", "Type-C"]);

export type Connector = z.infer<typeof Connector>;

export const Regex = new RegExp(
  `USB (${Generation.options.join("|")}) (${Connector.options.join("|")})`
);

export const toString = (generation: Generation, connector: Connector) =>
  `USB ${generation} ${connector}` as const;

export const Schema = z.custom<`USB ${Generation} ${Connector}`>((val) =>
  typeof val === "string" ? Regex.test(val) : false
);
