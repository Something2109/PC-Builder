import { CoolerCPUPlateType, FanBearingType } from "./utils";

export namespace Cooler {
  export type Info = {
    socket: string;
    cpu_plate: CoolerCPUPlateType;

    width: number;
    length: number;
    height: number;
  };

  export const BasicAttrList: (keyof Info)[] = ["socket"] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default Cooler;
