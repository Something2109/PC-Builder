import {
  CoolerCPUPlates,
  CoolerCPUPlateType,
  FilterOptionsType,
} from "../utils";

export namespace Cooler {
  export type Info = {
    socket: string;
    cpu_plate: CoolerCPUPlateType;

    width: number;
    length: number;
    height: number;
  };

  export const FilterAttributes = ["socket", "cpu_plate"] as const;

  export const DefaultFilterOptions: FilterOptions = {
    cpu_plate: CoolerCPUPlates,
  };

  export type Filterables = (typeof FilterAttributes)[number];

  export type FilterOptions = FilterOptionsType<Info, Filterables>;
}

export default Cooler;
