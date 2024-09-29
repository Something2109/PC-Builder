import {
  FilterOptionsType,
  SSDFormFactorType,
  SSDProtocolType,
  SSDInterfaceType,
  SSDFormFactors,
  SSDProtocols,
} from "../utils";

namespace SSD {
  export type Info = {
    memory_type: string;
    read_speed: number;
    write_speed: number;
    capacity: number;
    cache: number;
    tbw: number;

    form_factor: SSDFormFactorType;
    protocol: SSDProtocolType;
    interface: SSDInterfaceType;
  };

  export const FilterAttributes = [
    "form_factor",
    "protocol",
    "read_speed",
    "write_speed",
    "capacity",
  ] as const;

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: SSDFormFactors,
    protocol: SSDProtocols,
  };

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default SSD;
