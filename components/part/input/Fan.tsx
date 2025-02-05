import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Fan from "@/utils/interface/info/Fan";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Fan.Info]: FunctionComponent<{ value?: Fan.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <OptionSelect
      name="form_factor"
      options={FormFactor.Fan.options}
      defaultValue={value}
    />
  ),
  width: ({ value }) => (
    <Input type="number" step="0.01" name="width" defaultValue={value} />
  ),
  length: ({ value }) => (
    <Input type="number" step="0.01" name="length" defaultValue={value} />
  ),
  height: ({ value }) => (
    <Input type="number" step="0.01" name="height" defaultValue={value} />
  ),
  count: ({ value }) => (
    <Input type="number" name="count" defaultValue={value} />
  ),
  voltage: ({ value }) => (
    <Input type="number" name="voltage" defaultValue={value} />
  ),
  speed: ({ value }) => (
    <Input type="number" name="speed" defaultValue={value} />
  ),
  airflow: ({ value }) => (
    <Input type="number" name="airflow" defaultValue={value} />
  ),
  noise: ({ value }) => (
    <Input type="number" name="noise" defaultValue={value} />
  ),
  static_pressure: ({ value }) => (
    <Input type="number" name="static_pressure" defaultValue={value} />
  ),
  bearing: ({ value }) => (
    <OptionSelect
      name="bearing"
      options={Fan.Bearing.options}
      defaultValue={value}
    />
  ),
  connector: ({ value }) => (
    <OptionSelect
      name="connector"
      options={InternalConnectors.Fan.Connector.options}
      defaultValue={value}
    />
  ),
  rgb: ({ value }) => (
    <OptionSelect
      name="rgb"
      options={InternalConnectors.RGB.options}
      defaultValue={value}
    />
  ),
};

export default GenericInputTable(Components, Fan.Label);
