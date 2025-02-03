import { FilterOptions, NumberFilterOptions } from "../utils";
import { z } from "zod";

export namespace CPU {
  const CoreSchema = z.record(
    z.string(),
    z.object({
      count: z.number().optional(),

      base_frequency: z.number(),
      turbo_frequency: z.number().optional(),
    })
  );

  export type Core = z.infer<typeof CoreSchema>;

  export const Schema = z.object({
    family: z.string(),

    socket: z.string(),
    total_cores: z.number(),
    total_threads: z.number(),
    base_frequency: z.number(),
    turbo_frequency: z.number(),
    cores: CoreSchema,

    L2_cache: z.number(),
    L3_cache: z.number(),
    max_memory: z.number(),
    max_memory_channel: z.number(),
    max_memory_bandwidth: z.number(),

    tdp: z.number(),
    lithography: z.string(),
  });

  export type Info = z.infer<typeof Schema>;

  export const Label: { [key in keyof Info]: string } = {
    socket: "Socket",

    base_frequency: "Base Frequency",
    turbo_frequency: "Turbo Frequency",
    family: "Family",
    total_cores: "Total Cores",
    total_threads: "Total Threads",
    cores: "Cores",

    L2_cache: "L2 Cache",
    L3_cache: "L3 Cache",
    max_memory: "Max Memory Capacity",
    max_memory_channel: "Max Memory Channel",
    max_memory_bandwidth: "Max Memory Bandwidth",

    tdp: "TDP",
    lithography: "Lithography",
  };

  export const SummarySchema = Schema.pick({
    socket: true,
    total_cores: true,
    total_threads: true,
    base_frequency: true,
    turbo_frequency: true,
  });

  export const SummaryAttributes = SummarySchema.keyof().options;

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Summary = z.infer<typeof SummarySchema>;

  export const FilterOptionSchema = z
    .object({
      socket: FilterOptions(z.string()),
      total_cores: NumberFilterOptions,
      total_threads: NumberFilterOptions,
      base_frequency: NumberFilterOptions,
      turbo_frequency: NumberFilterOptions,
      L3_cache: NumberFilterOptions,
      tdp: NumberFilterOptions,
    })
    .partial();

  export const FilterAttributes = FilterOptionSchema.keyof().options;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = z.infer<typeof FilterOptionSchema>;
}

export default CPU;
