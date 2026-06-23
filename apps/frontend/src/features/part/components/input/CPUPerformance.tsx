import * as CPUPerformance from "@pc-builder/shared/part/info/CPUPerformance";
import { FrequencyUnits } from "@pc-builder/shared/Units";
import { ZodType } from "zod";

import { SuffixInput, UnitInput } from "@/ui/Input";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

export const Components: InfoComponentObject<CPUPerformance.DTO> = {
  base_frequency: (field) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...mapChange(field, "number")} />
  ),
  turbo_frequency: (field) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...mapChange(field, "number")} />
  ),
  tdp: (field) => <SuffixInput suffix="W" type="number" {...mapChange(field, "number")} />,
};

export default GenericSingleInputForm<CPUPerformance.DTO>(
  Components,
  CPUPerformance.Label,
  CPUPerformance.Schemas.DTO as ZodType<CPUPerformance.DTO, CPUPerformance.DTO>
);
