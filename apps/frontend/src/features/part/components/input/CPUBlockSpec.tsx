import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { OptionSelect } from "@/ui/Input";
import * as CPUBlockSpec from "@/utils/part/info/CPUBlockSpec";
import { InternalConnectors, Material } from "@/utils/interface";

const Components: InfoComponentObject<CPUBlockSpec.DTO> = {
  plate: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
  rgb: (props) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
  ),
};

function submit(formData: FormData) {
  return CPUBlockSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, CPUBlockSpec.Label),
  submit
);
