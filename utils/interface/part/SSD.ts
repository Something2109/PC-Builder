import { SSDFormFactorType, SSDProtocolType, SSDInterfaceType } from "./utils";

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

  export const BasicAttrList: (keyof Info)[] = [
    "form_factor",
    "protocol",
    "read_speed",
    "write_speed",
    "capacity",
  ] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default SSD;
