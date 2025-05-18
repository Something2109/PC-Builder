import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { SuffixDisplay, UnitDisplay } from "@/components/utils/Display";
import {
  MemorySpeedUnit,
  MemoryUnits,
  TransferSpeedUnit,
} from "@/utils/extract/Units";
import GPUMemory from "@/utils/interface/part/info/GPUMemory";

const Components: InfoComponentObject<GPUMemory.Info> = {
  type: ({ defaultValue }) => defaultValue,
  speed: ({ defaultValue }) => (
    <UnitDisplay
      Unit={TransferSpeedUnit}
      defaultUnit="MT/s"
      defaultValue={defaultValue}
    />
  ),
  capacity: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemoryUnits}
      defaultUnit="GB"
      defaultValue={defaultValue}
    />
  ),
  bandwidth: ({ defaultValue }) => (
    <UnitDisplay
      Unit={MemorySpeedUnit}
      defaultUnit="GB/s"
      defaultValue={defaultValue}
    />
  ),
  bus_width: ({ defaultValue }) => (
    <SuffixDisplay suffix="bit">{defaultValue}</SuffixDisplay>
  ),
};

export default InfoComponent(Components, GPUMemory.Label, { strict: true });
