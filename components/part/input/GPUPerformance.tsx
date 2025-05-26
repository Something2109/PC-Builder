import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { SuffixInput, UnitInput } from "@/components/utils/Input";
import GPUPerformance from "@/utils/interface/part/info/GPUPerformance";
import { FrequencyUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<GPUPerformance.Info> = {
  base_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
  ),
  boost_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
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

  return GPUPerformance.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, GPUPerformance.Label),
  submit
);
