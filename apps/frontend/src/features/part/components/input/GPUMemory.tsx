import { ZodType } from "zod";

import { OptionSelect, SuffixInput, UnitInput } from "@/ui/Input";
import { InternalConnectors } from "@/utils/interface";
import * as GPUMemory from "@/utils/part/info/GPUMemory";
import { MemorySpeedUnit, MemoryUnits, TransferSpeedUnit } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GPUMemory.DTO> = {
  type: ({ form: _, options: __, ...props }) => (
    <OptionSelect options={InternalConnectors.SGRAM.options} {...props} />
  ),
  speed: ({ form: _, ...props }) => (
    <UnitInput Unit={TransferSpeedUnit} defaultUnit="MT/s" {...props} />
  ),
  capacity: ({ form: _, ...props }) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  bandwidth: ({ form: _, ...props }) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="GB/s" {...props} />
  ),
  bus_width: ({ form: _, ...props }) => <SuffixInput suffix="bit" type="number" {...props} />,
};

export default GenericSingleInputForm<GPUMemory.DTO>(
  Components,
  GPUMemory.Label,
  GPUMemory.Schemas.DTO as ZodType<GPUMemory.DTO, GPUMemory.DTO>
);
