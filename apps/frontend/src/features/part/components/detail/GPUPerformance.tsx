import * as GPUPerformance from "@pc-builder/shared/part/info/GPUPerformance";
import { FrequencyUnits } from "@pc-builder/shared/Units";

import { UnitDisplay, SuffixDisplay } from "@/ui/Display";

import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<GPUPerformance.DTO> = {
  base_frequency: ({ defaultValue }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={defaultValue} />
  ),
  boost_frequency: ({ defaultValue }) => (
    <UnitDisplay Unit={FrequencyUnits} defaultUnit="MHz" defaultValue={defaultValue} />
  ),
  tdp: ({ defaultValue }) => <SuffixDisplay suffix="W">{defaultValue}</SuffixDisplay>,
};

export default InfoComponent(Components, GPUPerformance.Label, {
  strict: true,
});
