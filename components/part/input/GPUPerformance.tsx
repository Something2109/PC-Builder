import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { SuffixInput, UnitInput } from "@/components/utils/Input";
import GPUPerformance from "@/utils/interface/part/info/GPUPerformance";
import { FrequencyUnits } from "@/utils/extract/Units";

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
