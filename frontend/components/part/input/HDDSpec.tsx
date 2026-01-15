import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { SuffixInput, UnitInput, OptionSelect } from "@/components/utils/Input";
import * as HDDSpec from "@/utils/part/info/HDDSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import { MemoryUnits } from "@/utils/Units";

const Components: InfoComponentObject<HDDSpec.DTO> = {
  rotational_speed: (props) => (
    <SuffixInput suffix="RPM" type="number" {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  form_factor: (props) => (
    <OptionSelect options={FormFactor.HDD.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.Storage.HDD.options} {...props} />
  ),
};

function submit(formData: FormData) {
  return HDDSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, HDDSpec.Label),
  submit
);
