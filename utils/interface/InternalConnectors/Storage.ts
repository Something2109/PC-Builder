import { z } from "zod";

export const SSD = z.enum(["SATA", "U.2", "mSATA", "M.2 PCIe"]);

export type SSD = z.infer<typeof SSD>;

export const HDD = z.enum(["SATA", "SAS", "PATA"]);

export type HDD = z.infer<typeof HDD>;

export const Options = [...new Set([...SSD.options, ...HDD.options]).values()];

export const Schema = z.union([SSD, HDD]);
