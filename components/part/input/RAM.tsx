import { InputRow, SelectInputRow, GenericTable } from "../TableWrapper";
import RAM from "@/utils/interface/part/RAM";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof RAM.Info]: FunctionComponent<{ value: RAM.Info[key] }>;
} = {
  speed: ({ value }) => (
    <InputRow type="number" name="speed" label="Speed" defaultValue={value} />
  ),
  capacity: ({ value }) => (
    <InputRow
      type="number"
      name="capacity"
      label="Capacity"
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
  latency: ({ value }) => <></>,
  kit: ({ value }) => (
    <InputRow type="number" name="kit" label="RAM Kit" defaultValue={value} />
  ),
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.RAM.options}
      defaultValue={value}
    />
  ),
  interface: ({ value }) => (
    <SelectInputRow
      name="interface"
      label="Interface"
      options={InternalConnectors.RAM.options}
      defaultValue={value}
    />
  ),
};

export default GenericTable(Components);
