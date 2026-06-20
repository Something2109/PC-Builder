import { ZodType } from "zod";

import { UnitInput } from "@/ui/Input";
import * as ProcessorCache from "@pc-builder/shared/part/info/ProcessorCache";
import { MemoryUnits } from "@pc-builder/shared/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

export const Components: InfoComponentObject<ProcessorCache.DTO> = {
  L1_cache: ({ state, handleChange }) => (
    <UnitInput
      Unit={MemoryUnits}
      defaultUnit="MB"
      defaultValue={state.value ?? 0}
      onChange={(e) => handleChange(Number(e.target.value))}
    />
  ),
  L2_cache: ({ state, handleChange }) => (
    <UnitInput
      Unit={MemoryUnits}
      defaultUnit="MB"
      defaultValue={state.value ?? 0}
      onChange={(e) => handleChange(Number(e.target.value))}
    />
  ),
  L3_cache: ({ state, handleChange }) => (
    <UnitInput
      Unit={MemoryUnits}
      defaultUnit="MB"
      defaultValue={state.value ?? 0}
      onChange={(e) => handleChange(Number(e.target.value))}
    />
  ),
};

export default GenericSingleInputForm<ProcessorCache.DTO>(
  Components,
  ProcessorCache.Label,
  ProcessorCache.Schemas.DTO as ZodType<ProcessorCache.DTO, ProcessorCache.DTO>
);
