import { Input, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, Material } from "@/utils/interface";
import * as RadiatorSpec from "@/utils/part/info/RadiatorSpec";
import { LengthUnits } from "@/utils/Units";

import { defaultParse, GenericInputField } from "../utils/Form";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<RadiatorSpec.DTO> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Radiator.options} {...props} />
  ),
  width: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  fpi: (props) => <Input type="number" {...props} />,
  material: (props) => (
    <OptionSelect options={Material.Metal.options} {...props} />
  ),
};

function submit(formData: FormData) {
  return RadiatorSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, RadiatorSpec.Label),
  submit
);
