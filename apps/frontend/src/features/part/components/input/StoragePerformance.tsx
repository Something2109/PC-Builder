import { ZodType } from "zod";

import { UnitInput } from "@/ui/Input";
import * as StoragePerformance from "@/utils/part/info/StoragePerformance";
import { MemorySpeedUnit } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<StoragePerformance.DTO> = {
  read_speed: ({ form: _, ...props }) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="MB/s" {...props} />
  ),
  write_speed: ({ form: _, ...props }) => (
    <UnitInput Unit={MemorySpeedUnit} defaultUnit="MB/s" {...props} />
  ),
};

export default GenericSingleInputForm<StoragePerformance.DTO>(
  Components,
  StoragePerformance.Label,
  StoragePerformance.Schemas.DTO as ZodType<StoragePerformance.DTO, StoragePerformance.DTO>
);
