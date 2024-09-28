import {
  FilterOptionsType,
  HDDFormFactors,
  HDDFormFactorType,
  HDDProtocols,
  HDDProtocolType,
} from "../utils";

export namespace HDD {
  export type Info = {
    rotational_speed: number;
    read_speed: number;
    write_speed: number;
    capacity: number;
    cache: number;

    form_factor: HDDFormFactorType;
    protocol: HDDProtocolType;
    protocol_version: number;
  };

  export const FilterAttributes = [
    "form_factor",
    "protocol",
    "read_speed",
    "write_speed",
    "capacity",
    "rotational_speed",
  ] as const;

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: HDDFormFactors,
    protocol: HDDProtocols,
  };

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default HDD;
