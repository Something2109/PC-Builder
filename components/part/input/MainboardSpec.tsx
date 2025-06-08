import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { Input, SuffixInput, OptionSelect } from "@/components/utils/Input";
import MainboardSpec from "@/utils/interface/part/info/MainboardSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: InfoComponentObject<MainboardSpec.DTO> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Mainboard.options} {...props} />
  ),
  socket: (props) => <Input {...props} />,
  chipset: (props) => <Input {...props} />,
  ram_form_factor: (props) => (
    <OptionSelect options={FormFactor.RAM.options} {...props} />
  ),
  ram_interface: (props) => (
    <OptionSelect options={InternalConnectors.RAM.options} {...props} />
  ),
  ram_slot: (props) => (
    <SuffixInput suffix="slot(s)" type="number" {...props} />
  ),
};

function submit(formData: FormData) {
  return MainboardSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, MainboardSpec.Label),
  submit
);
