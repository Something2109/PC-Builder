import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
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
  return CPUPerformance.Schema.partial().parse(defaultParse(formData))!;
}

export default GenericInputField(
  InfoComponent(Components, CPUPerformance.Label),
  submit
);
