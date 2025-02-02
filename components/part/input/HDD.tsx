import { InputRow, SelectInputRow, GenericTable } from "../TableWrapper";
import HDD from "@/utils/interface/part/HDD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof HDD.Info]: FunctionComponent<{ value: HDD.Info[key] }>;
} = {
  rotational_speed: ({ value }) => (
    <InputRow
      type="number"
      name="rotational_speed"
      label="Rotational Speed"
      defaultValue={value}
    />
  ),
  read_speed: ({ value }) => (
    <InputRow
      type="number"
      name="read_speed"
      label="Read Speed"
      defaultValue={value}
    />
  ),
  write_speed: ({ value }) => (
    <InputRow
      type="number"
      name="write_speed"
      label="Write Speed"
      defaultValue={value}
    />
  ),
  capacity: ({ value }) => (
    <InputRow
      type="number"
      name="capacity"
      label="Capacity"
      defaultValue={value}
    />
  ),
  cache: ({ value }) => (
    <InputRow type="number" name="cache" label="Cache" defaultValue={value} />
  ),
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.HDD.options}
      defaultValue={value}
    />
  ),
  interface: ({ value }) => (
    <SelectInputRow
      name="interface"
      label="Interface"
      options={InternalConnectors.Storage.HDD.options}
      defaultValue={value}
    />
  ),
};

export default GenericTable(Components);
