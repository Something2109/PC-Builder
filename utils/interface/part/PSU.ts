import { PSUFormFactorType } from "./utils";

export namespace PSU {
  export type Info = {
    wattage: number;
    efficiency: string;

    form_factor: PSUFormFactorType;
    width: number;
    length: number;
    height: number;

    atx_pin: number;
    cpu_pin: number;
    pcie_pin: number;
    sata_pin: number;
    peripheral_pin: number;
  };

  export const BasicAttrList: (keyof Info)[] = [
    "wattage",
    "efficiency",
    "form_factor",
  ] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default PSU;
