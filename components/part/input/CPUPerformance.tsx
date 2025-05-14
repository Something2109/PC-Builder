import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { SuffixInput, UnitInput } from "@/components/utils/Input";
import CPUPerformance from "@/utils/interface/part/info/CPUPerformance";
import { FrequencyUnits } from "@/utils/extract/Units";

export const Components: InfoComponentObject<CPUPerformance.Info> = {
  base_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...props} />
  ),
  turbo_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...props} />
  ),
  tdp: (props) => <SuffixInput suffix="W" type="number" {...props} />,
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  return CPUPerformance.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, CPUPerformance.Label),
  submit
);
