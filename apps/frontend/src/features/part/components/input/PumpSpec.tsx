import { SuffixInput, UnitInput, OptionSelect } from "@/ui/Input";
import { FormFactor, InternalConnectors } from "@/utils/interface";
import * as PumpSpec from "@/utils/part/info/PumpSpec";
import { LengthUnits, VolumeSpeedUnit } from "@/utils/Units";

import { defaultParse, GenericInputField } from "../utils/Form";
import { InfoComponent, InfoComponentObject } from "../utils/Table";

const Components: InfoComponentObject<PumpSpec.DTO> = {
  form_factor: (props) => (
    <OptionSelect options={FormFactor.Pump.options} {...props} />
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
  voltage: (props) => (
    <SuffixInput suffix="V" type="number" step={0.01} {...props} />
  ),
  wattage: (props) => <SuffixInput suffix="W" type="number" {...props} />,
  head_pressure: (props) => (
    <SuffixInput suffix="m" type="number" step={0.01} {...props} />
  ),
  flow_rate: (props) => (
    <UnitInput Unit={VolumeSpeedUnit} defaultUnit="L/h" {...props} />
  ),
  power_connector: (props) => (
    <OptionSelect
      options={InternalConnectors.Power.Miscellanous.options}
      {...props}
    />
  ),
  control_connector: (props) => (
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
  return PumpSpec.Schemas.DTO.parse(defaultParse(formData));
}

export default GenericInputField(
  InfoComponent(Components, PumpSpec.Label),
  submit
);
