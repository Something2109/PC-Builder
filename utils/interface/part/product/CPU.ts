import { FilterOptions, NumberFilterOptions, Primitive } from "../../utils";
import { z } from "zod";

export namespace CPU {
  export const Label = "CPU";

  export const Summary = z
    .object({
      socket: Primitive.String,
      total_cores: Primitive.Number,
      total_threads: Primitive.Number,
      base_frequency: Primitive.Number,
      turbo_frequency: Primitive.Number,
      tdp: Primitive.Number,
    })
    .partial();

  export type Summary = z.infer<typeof Summary>;

  export const Filter = z
    .object({
      socket: FilterOptions(Primitive.String),
      total_cores: NumberFilterOptions,
      total_threads: NumberFilterOptions,
      base_frequency: NumberFilterOptions,
      turbo_frequency: NumberFilterOptions,
      L3_cache: NumberFilterOptions,
      tdp: NumberFilterOptions,
    })
    .partial();

  export type Filter = z.infer<typeof Filter>;

  export const AttributeLabels: {
    [key in keyof Required<Summary & Filter>]: string;
  } = {
    socket: "Socket",
    total_cores: "Total Cores",
    total_threads: "Total Threads",
    base_frequency: "Base Frequency",
    turbo_frequency: "Turbo Frequency",
    L3_cache: "L3 Cache",
    tdp: "TDP",
  };
}

export default CPU;
