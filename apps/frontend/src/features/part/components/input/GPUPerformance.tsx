import { ZodType } from "zod";

import { SuffixInput, UnitInput } from "@/ui/Input";
import * as GPUPerformance from "@/utils/part/info/GPUPerformance";
import { FrequencyUnits } from "@/utils/Units";

import { GenericSingleInputForm } from "../utils/TanstackForm";
import { InfoComponentObject } from "../utils/TanstackForm";

const Components: InfoComponentObject<GPUPerformance.DTO> = {
  base_frequency: ({ form: _, ...props }) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
  ),
  boost_frequency: ({ form: _, ...props }) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
  ),
  tdp: ({ form: _, ...props }) => <SuffixInput suffix="W" type="number" {...props} />,
};

export default GenericSingleInputForm<GPUPerformance.DTO>(
  Components,
  GPUPerformance.Label,
  GPUPerformance.Schemas.DTO as ZodType<GPUPerformance.DTO, GPUPerformance.DTO>
);
