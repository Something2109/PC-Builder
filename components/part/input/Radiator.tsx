import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import Radiator from "@/utils/interface/info/Radiator";
import { FormFactor, Material } from "@/utils/interface/utils";
import { Info } from "@/utils/Enum";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Radiator.Info]: FunctionComponent<{
    value?: Radiator.Info[key];
  }>;
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
  fpi: ({ value }) => <Input type="number" name="fpi" defaultValue={value} />,
  material: ({ value }) => (
    <OptionSelect
      name="material"
      options={Material.Metal.options}
      defaultValue={value}
    />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return Radiator.Schema.partial().parse(raw);
}

export default GenericInputTable(Components, Radiator.Label, submit);
