import {
  BaseInformation,
  BaseModelOptions,
  BasePartTable,
  Tables,
} from "../interface";

type FanSize = 120 | 140;

type AIOSize = 120 | 140 | 240 | 280 | 360 | 420;

type CaseSide = "top" | "bottom" | "front" | "rear" | "side";

type FanSupport = {
  [side in CaseSide]: {
    [size in FanSize]: number;
  };
};

type AIOSupport = {
  [side in CaseSide]: AIOSize[];
};

type HardDriveSupport = {
  2.5?: number;
  3.5?: number;
  combo: number;
};

class Case extends BasePartTable {
  declare form_factor: string;
  declare width: number;
  declare length: number;
  declare height: number;

  declare io_ports: {};

  declare mb_support: string[];
  declare expansion_slot: number;

  declare max_cooler_height: number;

  declare aio_support: AIOSupport;
  declare fan_support: FanSupport;

  declare hard_drive_support: HardDriveSupport;

  declare psu_support: string;
  declare max_psu_length?: number;
}

Case.init(
  { ...BaseInformation },
  {
    ...BaseModelOptions,
    modelName: Tables.CASE,
  }
);
