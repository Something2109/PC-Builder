import { ZodType } from "zod";

import { SuffixInput, UnitInput } from "@/ui/Input";
import * as CPUPerformance from "@/utils/part/info/CPUPerformance";
import { FrequencyUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

export const Components: InfoComponentObject<CPUPerformance.DTO> = {
  base_frequency: ({ form: _, ...props }) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...props} />
  ),
  turbo_frequency: ({ form: _, ...props }) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...props} />
  ),
  tdp: ({ form: _, ...props }) => <SuffixInput suffix="W" type="number" {...props} />,
};

export default GenericSingleInputForm<CPUPerformance.DTO>(
  Components,
  CPUPerformance.Label,
  CPUPerformance.Schemas.DTO as ZodType<CPUPerformance.DTO, CPUPerformance.DTO>
);
