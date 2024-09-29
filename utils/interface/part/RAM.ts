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

  export const FilterAttributes = [
    "capacity",
    "form_factor",
    "protocol",
  ] as const;

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: RAMFormFactors,
    protocol: RAMProtocols,
  };

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default RAM;
