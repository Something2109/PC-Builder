import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay, SuffixDisplay } from "@/components/utils/Display";
import GPUPerformance from "@/utils/interface/part/info/GPUPerformance";
import { FrequencyUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<GPUPerformance.DTO> = {
  base_frequency: ({ defaultValue }) => (
    <UnitDisplay
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      defaultValue={defaultValue}
    />
  ),
  boost_frequency: ({ defaultValue }) => (
    <UnitDisplay
      Unit={FrequencyUnits}
      defaultUnit="MHz"
      defaultValue={defaultValue}
    />
  ),
  tdp: ({ defaultValue }) => (
    <SuffixDisplay suffix="W">{defaultValue}</SuffixDisplay>
  ),
};

export default InfoComponent(Components, GPUPerformance.Label, {
  strict: true,
});
