import { FilterOptions, NumberFilterOptions, Primitive } from "../utils";
import { Infos } from "../../Enum";
import { z } from "zod";

export namespace CPU {
  export const Label = "CPU";

  export const Primary = [Infos.CPU, Infos.GPU];
  export const Secondary = [];

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

  export const AttributeLabels: { [key in keyof Required<Filter>]: string } = {
    socket: "Socket",
    total_cores: "Total Cores",
    total_threads: "Total Threads",
    base_frequency: "Base Frequency",
    turbo_frequency: "Turbo Frequency",
    L3_cache: "L3 Cache",
    tdp: "TDP",
  };

  export const AttributeMapping: Record<keyof Filter, [Infos, string]> = {
    socket: [Infos.CPU, "socket"],
    total_cores: [Infos.CPU, "total_cores"],
    total_threads: [Infos.CPU, "total_threads"],
    base_frequency: [Infos.CPU, "base_frequency"],
    turbo_frequency: [Infos.CPU, "turbo_frequency"],
    L3_cache: [Infos.CPU, "L3_cache"],
    tdp: [Infos.CPU, "tdp"],
  };
}

export default CPU;
