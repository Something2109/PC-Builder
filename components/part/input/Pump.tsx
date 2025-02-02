import Pump from "@/utils/interface/part/Pump";
import { InputRow, SelectInputRow, GenericTable } from "../TableWrapper";
import { FunctionComponent } from "react";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";

const Components: {
  [key in keyof Pump.Info]: FunctionComponent<{ value: Pump.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.Pump.options}
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
  voltage: ({ value }) => (
    <InputRow
      type="number"
      name="voltage"
      label="Voltage"
      defaultValue={value}
    />
  ),
  wattage: ({ value }) => (
    <InputRow
      type="number"
      name="wattage"
      label="Wattage"
      defaultValue={value}
    />
  ),
  head_pressure: ({ value }) => (
    <InputRow
      type="number"
      name="head_pressure"
      label="Head Pressure"
      defaultValue={value}
    />
  ),
  flow_rate: ({ value }) => (
    <InputRow
      type="number"
      name="flow_rate"
      label="Flow Rate"
      defaultValue={value}
    />
  ),
  power_connector: ({ value }) => (
    <SelectInputRow
      name="power_connector"
      label="Power Connector"
      options={InternalConnectors.Power.Miscellanous.options}
      defaultValue={value}
    />
  ),
  control_connector: ({ value }) => (
    <SelectInputRow
      name="control_connector"
      label="Control Connector"
      options={InternalConnectors.Fan.Connector.options}
      defaultValue={value}
    />
  ),
  rgb: ({ value }) => (
    <SelectInputRow
      name="rgb"
      label="RGB"
      options={InternalConnectors.RGB.options}
      defaultValue={value}
    />
  ),
};

export default GenericTable(Components);
