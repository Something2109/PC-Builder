import { ZodType } from "zod";

import { UnitInput } from "@/ui/Input";
import * as ProcessorCache from "@/utils/part/info/ProcessorCache";
import { MemoryUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

export const Components: InfoComponentObject<ProcessorCache.DTO> = {
  L1_cache: ({ form: _, ...props }) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
  L2_cache: ({ form: _, ...props }) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
  L3_cache: ({ form: _, ...props }) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="MB" {...props} />
  ),
};

export default GenericSingleInputForm<ProcessorCache.DTO>(
  Components,
  ProcessorCache.Label,
  ProcessorCache.Schemas.DTO as ZodType<ProcessorCache.DTO, ProcessorCache.DTO>
);
