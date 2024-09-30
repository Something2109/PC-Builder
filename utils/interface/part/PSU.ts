import {
  FilterOptionsType,
  PSUEfficiencies,
  PSUEfficiencyType,
  PSUFormFactors,
  PSUFormFactorType,
  PSUModulars,
  PSUModularType,
} from "../utils";

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

  export const SummaryAttributes = [
    "wattage",
    "efficiency",
    "form_factor",
    "modular",
  ] as const;

  export const FilterAttributes = [
    "wattage",
    "efficiency",
    "form_factor",
    "modular",
  ] as const;

  export const DefaultFilterOptions: FilterOptions = {
    efficiency: PSUEfficiencies,
    form_factor: PSUFormFactors,
    modular: PSUModulars,
  };

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Filterables = (typeof FilterAttributes)[number];

  export type Summary = {
    [key in Summarizable]: Info[key];
  };

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default PSU;
