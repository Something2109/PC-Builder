import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { OptionSelect } from "@/components/utils/Input";
import CPUBlockSpec from "@/utils/interface/part/info/CPUBlockSpec";
import { InternalConnectors, Material } from "@/utils/interface/utils";

const Components: InfoComponentObject<CPUBlockSpec.Info> = {
  plate: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
  rgb: (props) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
  ),
};

function submit(formData: FormData) {
  return CPUBlockSpec.Schema.partial().parse(defaultParse(formData))!;
}

export default GenericInputField(
  InfoComponent(Components, CPUBlockSpec.Label),
  submit
);
