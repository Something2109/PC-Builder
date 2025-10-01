import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { SuffixInput, UnitInput, OptionSelect } from "@/components/utils/Input";
import PSUSpec from "@/utils/interface/part/info/PSUSpec";
import { FormFactor } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<PSUSpec.DTO> = {
  wattage: (props) => <SuffixInput suffix="W" type="number" {...props} />,
  efficiency: (props) => (
    <OptionSelect options={PSUSpec.Efficiency.options} {...props} />
  ),
  form_factor: (props) => (
    <OptionSelect options={FormFactor.PSU.options} {...props} />
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
  modular: (props) => (
    <OptionSelect options={PSUSpec.Modular.options} {...props} />
  ),
};

function submit(formData: FormData) {
  return PSUSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, PSUSpec.Label),
  submit
);
