import { ZodType } from "zod";

import { OptionSelect, SuffixInput, UnitInput } from "@/ui/Input";
import { InternalConnectors } from "@pc-builder/shared/interface";
import * as GPUMemory from "@pc-builder/shared/part/info/GPUMemory";
import { MemorySpeedUnit, MemoryUnits, TransferSpeedUnit } from "@pc-builder/shared/Units";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GPUMemory.DTO> = {
  type: (field) => (
    <OptionSelect options={InternalConnectors.SGRAM.options} {...mapChange(field, "select")} />
  ),
  speed: (field) => (
    <UnitInput Unit={TransferSpeedUnit} defaultUnit="MT/s" {...mapChange(field, "number")} />
  ),
  capacity: (field) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...mapChange(field, "number")} />
  ),
  bandwidth: (field) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="GB/s" {...mapChange(field, "number")} />
  ),
  bus_width: (field) => <SuffixInput suffix="bit" type="number" {...mapChange(field, "number")} />,
};

export default GenericSingleInputForm<GPUMemory.DTO>(
  Components,
  GPUMemory.Label,
  GPUMemory.Schemas.DTO as ZodType<GPUMemory.DTO, GPUMemory.DTO>
);
