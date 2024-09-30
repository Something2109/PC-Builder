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

  export const SummaryAttributes = ["form_factor", "bearing", "speed"] as const;

  export const FilterAttributes = ["form_factor", "bearing"] as const;

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: FanFormFactors,
    bearing: FanBearings,
  };

  export type Summarizable = (typeof SummaryAttributes)[number];

  export type Filterables = (typeof FilterAttributes)[number];

  export type Summary = {
    [key in Summarizable]: Info[key];
  };

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default Fan;
