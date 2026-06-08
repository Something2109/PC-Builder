import { Input, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor } from "@/utils/interface";
import * as CaseSpec from "@/utils/part/info/CaseSpec";
import { LengthUnits } from "@/utils/Units";

import { defaultParse, GenericInputField } from "../utils/Form";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<CaseSpec.DTO> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Case.options} {...props} />
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
  expansion_slot: (props) => <Input type="number" {...props} />,
  max_cooler_height: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
  max_psu_length: (props) => (
    <UnitInput Unit={LengthUnits} defaultUnit="mm" {...props} />
  ),
};

function submit(formData: FormData) {
  return CaseSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, CaseSpec.Label),
  submit
);
