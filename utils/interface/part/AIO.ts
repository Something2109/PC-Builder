import {
  AIOFormFactors,
  AIOFormFactorType,
  CoolerCPUPlates,
  CoolerCPUPlateType,
  FilterOptionsType,
} from "../utils";

export namespace AIO {
  export type Info = {
    form_factor: AIOFormFactorType;

    radiator_width: number;
    radiator_length: number;
    radiator_height: number;

    socket: string;
    cpu_plate: CoolerCPUPlateType;

    pump_width: number;
    pump_length: number;
    pump_height: number;
    pump_speed: number;
  };

  export const FilterAttributes = [
    "form_factor",
    "socket",
    "cpu_plate",
  ] as const;

  export const DefaultFilterOptions: FilterOptions = {
    form_factor: AIOFormFactors,
    cpu_plate: CoolerCPUPlates,
  };

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default AIO;
