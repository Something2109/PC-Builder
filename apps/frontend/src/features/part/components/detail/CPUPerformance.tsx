import { UnitDisplay, SuffixDisplay } from "@/ui/Display";
import * as CPUPerformance from "@pc-builder/shared/part/info/CPUPerformance";
import { FrequencyUnits } from "@pc-builder/shared/Units";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<CPUPerformance.DTO> = {
  base_frequency: ({ defaultValue }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="GHz" defaultValue={defaultValue} />
  ),
  turbo_frequency: ({ defaultValue }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="GHz" defaultValue={defaultValue} />
  ),
  tdp: ({ defaultValue }) => <SuffixDisplay suffix="W">{defaultValue}</SuffixDisplay>,
};

export default InfoComponent(Components, CPUPerformance.Label, {
  strict: true,
});
