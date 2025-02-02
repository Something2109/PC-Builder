import { InputRow, SelectInputRow, GenericTable } from "../TableWrapper";
import PSU from "@/utils/interface/part/PSU";
import { FormFactor } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof PSU.Info]: FunctionComponent<{ value: PSU.Info[key] }>;
} = {
  wattage: ({ value }) => (
    <InputRow
      type="number"
      name="wattage"
      label="Wattage"
      defaultValue={value}
    />
  ),
  efficiency: ({ value }) => (
    <SelectInputRow
      name="efficiency"
      label="Efficiency"
      options={PSU.Efficiency.options}
      defaultValue={value}
    />
  ),
  form_factor: ({ value }) => (
    <SelectInputRow
      name="form_factor"
      label="Form Factor"
      options={FormFactor.PSU.options}
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
  modular: ({ value }) => (
    <SelectInputRow
      name="modular"
      label="Modular"
      options={PSU.Modular.options}
      defaultValue={value}
    />
  ),
  atx_pin: ({ value }) => (
    <InputRow
      type="number"
      name="atx_pin"
      label="ATX Pin"
      defaultValue={value}
    />
  ),
  cpu_pin: ({ value }) => (
    <InputRow
      type="number"
      name="cpu_pin"
      label="CPU Pin"
      defaultValue={value}
    />
  ),
  pcie_pin: ({ value }) => (
    <InputRow
      type="number"
      name="pcie_pin"
      label="PCIe Pin"
      defaultValue={value}
    />
  ),
  sata_pin: ({ value }) => (
    <InputRow
      type="number"
      name="sata_pin"
      label="SATA Pin"
      defaultValue={value}
    />
  ),
  peripheral_pin: ({ value }) => (
    <InputRow
      type="number"
      name="peripheral_pin"
      label="Peripheral Pin"
      defaultValue={value}
    />
  ),
};

export default GenericTable(Components);
