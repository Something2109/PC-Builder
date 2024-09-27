import {
  FilterOptionsType,
  PSUEfficiencyType,
  PSUFormFactorType,
  PSUModularType,
} from "./utils";

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

  export const FilterAttributes = [
    "wattage",
    "efficiency",
    "form_factor",
    "modular",
  ] as const;

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default PSU;
