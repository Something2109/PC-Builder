import GPU from "./GPU";
import {
  ExternalPorts,
  InternalConnectors,
  NumberFilterOptions,
} from "../utils";
import { z } from "zod";

namespace GraphicCard {
  export const PowerConnectorSchema = z.record(
    InternalConnectors.Power.GraphicCard,
    z.number()
  );

  export type PowerConnectorType = z.infer<typeof PowerConnectorSchema>;

  export const PortSchema = z.record(ExternalPorts.Display.Schema, z.number());

  export type PortType = z.infer<typeof PortSchema>;

  export const Schema = z.object({
    width: z.number(),
    length: z.number(),
    height: z.number(),

    base_frequency: z.number(),
    boost_frequency: z.number(),

    pcie: z.number(),
    minimum_psu: z.number(),
    power_connector: PowerConnectorSchema,
    port: PortSchema,

    gpu: GPU.Schema,
  });

  export type Info = z.infer<typeof Schema>;

  export const SummarySchema = Schema.pick({
    length: true,
    base_frequency: true,
    boost_frequency: true,
    minimum_psu: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      width: NumberFilterOptions,
      length: NumberFilterOptions,
      height: NumberFilterOptions,
      base_frequency: NumberFilterOptions,
      boost_frequency: NumberFilterOptions,
      minimum_psu: NumberFilterOptions,
    })
    .partial();

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default GraphicCard;
