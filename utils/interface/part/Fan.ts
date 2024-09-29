import {
  FanBearings,
  FanBearingType,
  FanFormFactors,
  FanFormFactorType,
  FilterOptionsType,
} from "../utils";

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

  export const FilterAttributes = ["form_factor", "bearing"] as const;

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FanFormFactors,
    bearing: FanBearings,
  };

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default Fan;
