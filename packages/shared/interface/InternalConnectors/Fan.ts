import { z } from "zod";

export const Type = z.enum(["CPU", "CPU OPT", "AIO Pump", "Radiator", "Q Fan", "H AMP", "Chassis"]);

export type Type = z.infer<typeof Type>;

export const Connector = z.enum(["3 pin", "4 pin"]);

export type Connector = z.infer<typeof Connector>;

export const Regex = new RegExp(
  `(${Connector.options.join("|")}) (${Type.options.join("|")}) Fan Connector`
);

export const toString = (connector: Connector, type: Type) =>
  `${connector} ${type} Fan Connector` as const;

export const Schema = z.custom<ReturnType<typeof toString>>((val) =>
  typeof val === "string" ? Regex.test(val) : false
);
