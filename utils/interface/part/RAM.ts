import {
  FilterOptionsType,
  RAMFormFactors,
  RAMFormFactorType,
  RAMProtocols,
  RAMProtocolType,
} from "../utils";

namespace RAM {
  export type Info = {
    speed: number;
    capacity: number;
    voltage: number;
    latency: number[];
    kit: number;

    form_factor: RAMFormFactorType;
    protocol: RAMProtocolType;
  };

  export const SummaryAttributes = [
    "speed",
    "capacity",
    "form_factor",
    "protocol",
  ] as const;

  export const FilterAttributes = [
    "capacity",
    "form_factor",
    "protocol",
  ] as const;

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: RAMFormFactors,
    protocol: RAMProtocols,
  };

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Filterables = (typeof FilterAttributes)[number];

  export type Summary = {
    [key in Summarizable]: Info[key];
  };

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default RAM;
