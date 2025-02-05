import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import PSU from "@/utils/interface/info/PSU";
import { FormFactor } from "@/utils/interface/utils";
import { Info } from "@/utils/Enum";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof PSU.Info]: FunctionComponent<{ value?: PSU.Info[key] }>;
} = {
  wattage: ({ value }) => (
    <Input type="number" name="wattage" defaultValue={value} />
  ),
  efficiency: ({ value }) => (
    <OptionSelect
      name="efficiency"
      options={PSU.Efficiency.options}
      defaultValue={value}
    />
  ),
  form_factor: ({ value }) => (
    <OptionSelect
      name="form_factor"
      options={FormFactor.PSU.options}
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
  modular: ({ value }) => (
    <OptionSelect
      name="modular"
      options={PSU.Modular.options}
      defaultValue={value}
    />
  ),
  atx_pin: ({ value }) => (
    <Input type="number" name="atx_pin" defaultValue={value} />
  ),
  cpu_pin: ({ value }) => (
    <Input type="number" name="cpu_pin" defaultValue={value} />
  ),
  pcie_pin: ({ value }) => (
    <Input type="number" name="pcie_pin" defaultValue={value} />
  ),
  sata_pin: ({ value }) => (
    <Input type="number" name="sata_pin" defaultValue={value} />
  ),
  peripheral_pin: ({ value }) => (
    <Input type="number" name="peripheral_pin" defaultValue={value} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return PSU.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, PSU.Label, submit);
