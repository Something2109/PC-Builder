import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { SuffixInput, UnitInput } from "@/components/utils/Input";
import * as CPUPerformance from "@/utils/part/info/CPUPerformance";
import { FrequencyUnits } from "@/utils/Units";

export const Components: InfoComponentObject<CPUPerformance.DTO> = {
  base_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...props} />
  ),
  turbo_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="GHz" {...props} />
  ),
  tdp: (props) => <SuffixInput suffix="W" type="number" {...props} />,
};

function submit(formData: FormData) {
  return CPUPerformance.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, CPUPerformance.Label),
  submit
);
