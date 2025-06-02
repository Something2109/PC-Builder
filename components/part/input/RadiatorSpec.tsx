import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import { Input, UnitInput, OptionSelect } from "@/components/utils/Input";
import RadiatorSpec from "@/utils/interface/part/info/RadiatorSpec";
import { FormFactor, Material } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<RadiatorSpec.Info> = {
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
  return RadiatorSpec.Schema.partial().parse(defaultParse(formData))!;
}

export default GenericInputField(
  InfoComponent(Components, RadiatorSpec.Label),
  submit
);
