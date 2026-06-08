import { UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as SSDSpec from "@/utils/part/info/SSDSpec";
import { MemoryUnits } from "@/utils/Units";

import { defaultParse, GenericInputField } from "../utils/Form";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<SSDSpec.DTO> = {
  memory_type: (props) => (
    <OptionSelect options={SSDSpec.MemoryCell.options} {...props} />
  ),
  capacity: (props) => (
    <UnitInput Unit={MemoryUnits} defaultUnit="GB" {...props} />
  ),
  tbw: (props) => <UnitInput Unit={MemoryUnits} defaultUnit="TB" {...props} />,
  form_factor: (props) => (
    <OptionSelect options={FormFactor.SSD.options} {...props} />
  ),
  interface: (props) => (
    <OptionSelect options={InternalConnectors.Storage.SSD.options} {...props} />
  ),
};

function submit(formData: FormData) {
  return SSDSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, SSDSpec.Label),
  submit
);
