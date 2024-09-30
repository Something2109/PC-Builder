import {
  AIOFormFactorType,
  CaseFormFactors,
  CaseFormFactorType,
  CaseSideType,
  FanFormFactorType,
  MainboardFormFactors,
  MainboardFormFactorType,
  PSUFormFactors,
  PSUFormFactorType,
  FilterOptionsType,
} from "../utils";

export namespace Case {
  export type FanSupport = {
    [side in CaseSideType]: {
      [size in FanFormFactorType]: number;
    };
  };

  export type AIOSupport = {
    [side in CaseSideType]: AIOFormFactorType[];
  };

  export type HardDriveSupport = {
    2.5?: number;
    3.5?: number;
    combo: number;
  };

  export type Info = {
    form_factor: CaseFormFactorType;

    width: number;
    length: number;
    height: number;

    io_ports: {};

    mb_support: MainboardFormFactorType;
    expansion_slot: number;

    max_cooler_height: number;

    aio_support: AIOSupport;
    fan_support: FanSupport;

    hard_drive_support: HardDriveSupport;

    psu_support: PSUFormFactorType;
    max_psu_length?: number;
  };

  export const SummaryAttributes = [
    "form_factor",
    "mb_support",
    "psu_support",
  ] as const;

  export const FilterAttributes = [
    "form_factor",
    "mb_support",
    "psu_support",
  ] as const;

  export const DefaultFilterOptions = {
    form_factor: CaseFormFactors,
    mb_support: MainboardFormFactors,
    psu_support: PSUFormFactors,
  };

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Filterables = (typeof FilterAttributes)[number];

  export type Summary = {
    [key in Summarizable]: Info[key];
  };

  export type FilterOptions = Omit<
    FilterOptionsType<Info, Filterables>,
    "mb_support"
  > & {
    mb_support: MainboardFormFactorType[];
  };
}

export default Case;
