import { PSUEfficiencyType, PSUFormFactorType, PSUModularType } from "./utils";

export namespace PSU {
  export type Info = {
    wattage: number;
    efficiency: PSUEfficiencyType;

    form_factor: PSUFormFactorType;
    width: number;
    length: number;
    height: number;
    modular: PSUModularType;

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
    "modular",
  ] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default PSU;
