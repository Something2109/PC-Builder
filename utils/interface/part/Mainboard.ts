import {
  FilterOptionsType,
  MainboardFormFactorType,
  RAMFormFactorType,
  RAMProtocolType,
} from "./utils";

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

  export const FilterAttributes = [
    "form_factor",
    "socket",
    "ram_form_factor",
    "ram_protocol",
  ] as const;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default Mainboard;
