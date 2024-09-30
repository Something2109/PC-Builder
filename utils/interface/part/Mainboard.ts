import {
  FilterOptionsType,
  MainboardFormFactors,
  MainboardFormFactorType,
  RAMFormFactors,
  RAMFormFactorType,
  RAMProtocols,
  RAMProtocolType,
} from "../utils";

namespace Mainboard {
  export type Info = {
    form_factor: MainboardFormFactorType;

    socket: string;

    ram_form_factor: RAMFormFactorType;
    ram_protocol: RAMProtocolType;
    ram_slot: number;
    expansion_slots: number;

    io_ports: {};
  };

  export const SummaryAttributes = [
    "form_factor",
    "socket",
    "ram_form_factor",
    "ram_protocol",
  ] as const;

  export const FilterAttributes = [
    "form_factor",
    "socket",
    "ram_form_factor",
    "ram_protocol",
  ] as const;

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: MainboardFormFactors,
    ram_form_factor: RAMFormFactors,
    ram_protocol: RAMProtocols,
  };

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Filterables = (typeof FilterAttributes)[number];

  export type Summary = {
    [key in Summarizable]: Info[key];
  };

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default Mainboard;
