import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import { SuffixInput, UnitInput, OptionSelect } from "@/components/utils/Input";
import Pump from "@/utils/interface/info/Pump";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { LengthUnits, VolumeSpeedUnit } from "@/utils/extract/Units";
import { DetailInfo } from "@/utils/interface";
import { Infos } from "@/utils/Enum";

const Schema = DetailInfo.shape[Infos.PUMP];

const Components: InfoInputMapping<Pump.Info> = {
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

  return Schema.parse(raw)!;
}

export default GenericInputTable(Components, Pump.Label, submit);
