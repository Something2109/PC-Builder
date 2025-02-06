import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Pump from "@/utils/interface/info/Pump";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { Info } from "@/utils/Enum";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Pump.Info]: FunctionComponent<{ value?: Pump.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <OptionSelect
      name="form_factor"
      options={FormFactor.Pump.options}
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
  voltage: ({ value }) => (
    <Input type="number" name="voltage" defaultValue={value} />
  ),
  wattage: ({ value }) => (
    <Input type="number" name="wattage" defaultValue={value} />
  ),
  head_pressure: ({ value }) => (
    <Input type="number" name="head_pressure" defaultValue={value} />
  ),
  flow_rate: ({ value }) => (
    <Input type="number" name="flow_rate" defaultValue={value} />
  ),
  power_connector: ({ value }) => (
    <OptionSelect
      name="power_connector"
      options={InternalConnectors.Power.Miscellanous.options}
      defaultValue={value}
    />
  ),
  control_connector: ({ value }) => (
    <OptionSelect
      name="control_connector"
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

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return Pump.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, Pump.Label, submit);
