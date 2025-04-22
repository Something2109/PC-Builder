import { GenericInputTable, InfoInputMapping } from "../TableWrapper";
import {
  Input,
  UnitInput,
  OptionSelect,
  SuffixInput,
} from "@/components/utils/Input";
import Part from "@/utils/interface/part";
import Fan from "@/utils/interface/part/info/Fan";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { LengthUnits } from "@/utils/extract/Units";
import { Infos } from "@/utils/Enum";

const Schema = Part.Detail.shape[Infos.FAN];

const Components: InfoInputMapping<Fan.Info> = {
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
  bearing: (props) => <OptionSelect options={Fan.Bearing.options} {...props} />,
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

export default GenericInputTable(Components, Fan.Label, submit);
