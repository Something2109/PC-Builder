import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { UnitDisplay, SuffixDisplay } from "@/components/utils/Display";
import CPUPerformance from "@/utils/interface/part/info/CPUPerformance";
import { FrequencyUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<CPUPerformance.DTO> = {
  base_frequency: ({ defaultValue }) => (
    <UnitDisplay
      Unit={FrequencyUnits}
      defaultUnit="GHz"
      defaultValue={defaultValue}
    />
  ),
  turbo_frequency: ({ defaultValue }) => (
    <UnitDisplay
      Unit={FrequencyUnits}
      defaultUnit="GHz"
      defaultValue={defaultValue}
    />
  ),
  tdp: ({ defaultValue }) => (
    <SuffixDisplay suffix="W">{defaultValue}</SuffixDisplay>
  ),
};

export default InfoComponent(Components, CPUPerformance.Label, {
  strict: true,
});
