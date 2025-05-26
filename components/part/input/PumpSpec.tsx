import { InfoComponent, InfoComponentObject } from "../utils/Table";
import { GenericInputField } from "../utils/Form";
import { SuffixInput, UnitInput, OptionSelect } from "@/components/utils/Input";
import PumpSpec from "@/utils/interface/part/info/PumpSpec";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { LengthUnits, VolumeSpeedUnit } from "@/utils/extract/Units";

const Components: InfoComponentObject<PumpSpec.Info> = {
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
  const raw = Object.fromEntries(
    formData
      .entries()
      .map(([key, value]) => [
        key,
        value === "" || Number(value) === 0 ? undefined : value,
      ])
  ) as Record<string, string | string[]>;

  return PumpSpec.Schema.parse(raw)!;
}

export default GenericInputField(
  InfoComponent(Components, PumpSpec.Label),
  submit
);
