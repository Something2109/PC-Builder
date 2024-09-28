import { FilterOptionsType } from "../utils";

export namespace CPU {
  export type Core = {
    [key in string]: {
      count?: number;

      base_frequency: number;
      turbo_frequency?: number;
    };
  };

  export type Info = {
    family: string;

    socket: string;
    total_cores: number;
    total_threads: number;
    base_frequency: number;
    turbo_frequency: number;
    cores: Core;

    L2_cache: number;
    L3_cache: number;
    max_memory: number;
    max_memory_channel: number;
    max_memory_bandwidth: number;

    tdp: number;
    lithography: string;
  };

  export const FilterAttributes = [
    "socket",
    "total_cores",
    "total_threads",
    "base_frequency",
    "turbo_frequency",
    "L3_cache",
    "tdp",
  ] as const;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default CPU;
