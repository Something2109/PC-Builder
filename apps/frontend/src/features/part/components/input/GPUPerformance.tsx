import { ZodType } from "zod";

import { SuffixInput, UnitInput } from "@/ui/Input";
import * as GPUPerformance from "@/utils/part/info/GPUPerformance";
import { FrequencyUnits } from "@/utils/Units";

import { GenericSingleInputForm, mapChange } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GPUPerformance.DTO> = {
  base_frequency: (field) => (
    <UnitInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      {...mapChange(field, "number")}
    />
  ),
  boost_frequency: (field) => (
    <UnitInput
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      {...mapChange(field, "number")}
    />
  ),
  tdp: (field) => (
    <SuffixInput
      suffix="W"
      type="number"
      {...mapChange(field, "number")}
    />
  ),
};

export default GenericSingleInputForm<GPUPerformance.DTO>(
  Components,
  GPUPerformance.Label,
  GPUPerformance.Schemas.DTO as ZodType<GPUPerformance.DTO, GPUPerformance.DTO>
);
