import { RAMFormFactorType, RAMProtocolType } from "./utils";

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

  export const BasicAttrList: (keyof Info)[] = [
    "capacity",

    "form_factor",
    "protocol",
  ] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default RAM;
