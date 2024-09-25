import { AIOFormFactorType, CoolerCPUPlateType } from "./utils";

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

  export const BasicAttrList: (keyof Info)[] = ["form_factor"] as const;

  type BasicAttributes = (typeof BasicAttrList)[number];

  export type Filterables = BasicAttributes;
}

export default AIO;
