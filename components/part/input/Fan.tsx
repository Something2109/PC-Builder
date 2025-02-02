import { InputRow, SelectInputRow, GenericTable } from "../TableWrapper";
import Fan from "@/utils/interface/part/Fan";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Fan.Info]: FunctionComponent<{ value: Fan.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.Fan.options}
      defaultValue={value}
    />
  ),
  width: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="width"
      label="Width"
      defaultValue={value}
    />
  ),
  length: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="length"
      label="Length"
      defaultValue={value}
    />
  ),
  height: ({ value }) => (
    <InputRow
      type="number"
      step="0.01"
      name="height"
      label="Height"
      defaultValue={value}
    />
  ),
  count: ({ value }) => (
    <InputRow type="number" name="count" label="Count" defaultValue={value} />
  ),
  voltage: ({ value }) => (
    <InputRow
      type="number"
      name="voltage"
      label="Voltage"
      defaultValue={value}
    />
  ),
  speed: ({ value }) => (
    <InputRow type="number" name="speed" label="Speed" defaultValue={value} />
  ),
  airflow: ({ value }) => (
    <InputRow
      type="number"
      name="airflow"
      label="Airflow"
      defaultValue={value}
    />
  ),
  noise: ({ value }) => (
    <InputRow type="number" name="noise" label="Noise" defaultValue={value} />
  ),
  static_pressure: ({ value }) => (
    <InputRow
      type="number"
      name="static_pressure"
      label="Static Pressure"
      defaultValue={value}
    />
  ),
  bearing: ({ value }) => (
    <SelectInputRow
      name="bearing"
      label="Bearing"
      options={Fan.Bearing.options}
      defaultValue={value}
    />
  ),
  connector: ({ value }) => (
    <SelectInputRow
      name="connector"
      label="Power Connector"
      options={InternalConnectors.Fan.Connector.options}
      defaultValue={value}
    />
  ),
  rgb: ({ value }) => (
    <SelectInputRow
      name="rgb"
      label="RGB Connector"
      options={InternalConnectors.RGB.options}
      defaultValue={value}
    />
  ),
};

export default GenericTable(Components);
