import {
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

  export const BasicAttrList: (keyof Info)[] = [
    "form_factor",
    "socket",
    "ram_protocol",
  ] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default Mainboard;
