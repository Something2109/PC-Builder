import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { defaultParse, GenericInputField } from "../utils/Form";
import {
  Input,
  UnitInput,
  OptionSelect,
  SuffixInput,
} from "@/components/utils/Input";
import FanSpec from "@/utils/interface/part/info/FanSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";

const Components: InfoComponentObject<FanSpec.DTO> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Fan.options} {...props} />
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
  count: (props) => <Input type="number" {...props} />,
  voltage: (props) => (
    <SuffixInput suffix="V" type="number" step={0.01} {...props} />
  ),
  speed: (props) => <SuffixInput suffix="RPM" type="number" {...props} />,
  airflow: (props) => (
    <SuffixInput suffix="CFM" type="number" step={0.01} {...props} />
  ),
  noise: (props) => (
    <SuffixInput suffix="dBA" type="number" step={0.01} {...props} />
  ),
  static_pressure: (props) => (
    <SuffixInput suffix="mm H₂O" type="number" step={0.01} {...props} />
  ),
  bearing: (props) => (
    <OptionSelect options={FanSpec.Bearing.options} {...props} />
  ),
  connector: (props) => (
    <OptionSelect
      options={InternalConnectors.Fan.Connector.options}
      {...props}
    />
  ),
  rgb: (props) => (
    <OptionSelect options={InternalConnectors.RGB.options} {...props} />
  ),
};

function submit(formData: FormData) {
  return FanSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, FanSpec.Label),
  submit
);
