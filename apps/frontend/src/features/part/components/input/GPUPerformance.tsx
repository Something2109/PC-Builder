import { SuffixInput, UnitInput } from "@/ui/Input";
import * as GPUPerformance from "@/utils/part/info/GPUPerformance";
import { FrequencyUnits } from "@/utils/Units";

import { defaultParse, GenericInputField } from "../utils/Form";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<GPUPerformance.DTO> = {
  base_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
  ),
  boost_frequency: (props) => (
    <UnitInput Unit={FrequencyUnits} defaultUnit="MHz" {...props} />
  ),
  tdp: (props) => <SuffixInput suffix="W" type="number" {...props} />,
};

function submit(formData: FormData) {
  return GPUPerformance.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, GPUPerformance.Label),
  submit
);
