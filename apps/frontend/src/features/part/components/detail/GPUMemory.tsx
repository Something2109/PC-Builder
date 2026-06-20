import { SuffixDisplay, UnitDisplay } from "@/ui/Display";
import * as GPUMemory from "@pc-builder/shared/part/info/GPUMemory";
import { MemorySpeedUnit, MemoryUnits, TransferSpeedUnit } from "@pc-builder/shared/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<GPUMemory.DTO> = {
  type: ({ defaultValue }) => defaultValue,
  speed: ({ defaultValue }) => (
    <UnitDisplay Unit={TransferSpeedUnit} defaultUnit="MT/s" defaultValue={defaultValue} />
  ),
  capacity: ({ defaultValue }) => (
    <UnitDisplay Unit={MemoryUnits} defaultUnit="GB" defaultValue={defaultValue} />
  ),
  bandwidth: ({ defaultValue }) => (
    <UnitDisplay Unit={MemorySpeedUnit} defaultUnit="GB/s" defaultValue={defaultValue} />
  ),
  bus_width: ({ defaultValue }) => <SuffixDisplay suffix="bit">{defaultValue}</SuffixDisplay>,
};

export default InfoComponent(Components, GPUMemory.Label, { strict: true });
