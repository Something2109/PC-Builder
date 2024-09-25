import {
  AIOFormFactorType,
  CaseFormFactorType,
  CaseSideType,
  FanFormFactorType,
  MainboardFormFactorType,
  PSUFormFactorType,
} from "./utils";

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

    mb_support: MainboardFormFactorType[];
    expansion_slot: number;

    max_cooler_height: number;

    aio_support: AIOSupport;
    fan_support: FanSupport;

    hard_drive_support: HardDriveSupport;

    psu_support: PSUFormFactorType;
    max_psu_length?: number;
  };

  export const BasicAttrList: (keyof Info)[] = [
    "form_factor",
    "mb_support",
  ] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default Case;
