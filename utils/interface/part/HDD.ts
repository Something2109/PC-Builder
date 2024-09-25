import { HDDFormFactorType, HDDProtocolType } from "./utils";

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

  export const BasicAttrList: (keyof Info)[] = [
    "form_factor",
    "protocol",
    "read_speed",
    "write_speed",
    "capacity",
    "rotational_speed",
  ] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default HDD;
