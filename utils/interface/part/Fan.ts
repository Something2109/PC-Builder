import { FanBearingType, FanFormFactorType } from "./utils";

namespace Fan {
  export type Info = {
    form_factor: FanFormFactorType;

    width: number;
    length: number;
    height: number;

    voltage: number;

    speed: number;
    airflow: number;
    noise: number;
    static_pressure: number;
    bearing: FanBearingType;
  };

  export const BasicAttrList: (keyof Info)[] = [] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default Fan;
