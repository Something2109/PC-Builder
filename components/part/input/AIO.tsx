import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import AIO from "@/utils/interface/info/AIO";
import { FormFactor, Material } from "@/utils/interface/utils";
import { Info } from "@/utils/Enum";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof AIO.Info]: FunctionComponent<{ value?: AIO.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <OptionSelect
      name="form_factor"
      options={FormFactor.Radiator.options}
      defaultValue={value}
    />
  ),
  socket: ({ value }) => <Input name="socket" defaultValue={value} />,
  cpu_plate: ({ value }) => (
    <OptionSelect
      name="cpu_plate"
      options={Material.Metal.options}
      defaultValue={value}
    />
  ),
  radiator_width: ({ value }) => (
    <Input
      type="number"
      step="0.01"
      name="radiator_width"
      defaultValue={value}
    />
  ),
  radiator_length: ({ value }) => (
    <Input
      type="number"
      step="0.01"
      name="radiator_length"
      defaultValue={value}
    />
  ),
  radiator_height: ({ value }) => (
    <Input
      type="number"
      step="0.01"
      name="radiator_height"
      defaultValue={value}
    />
  ),
  pump_width: ({ value }) => (
    <Input type="number" step="0.01" name="pump_width" defaultValue={value} />
  ),
  pump_length: ({ value }) => (
    <Input type="number" step="0.01" name="pump_length" defaultValue={value} />
  ),
  pump_height: ({ value }) => (
    <Input type="number" step="0.01" name="pump_height" defaultValue={value} />
  ),
  pump_speed: ({ value }) => (
    <Input type="number" step="0.01" name="pump_speed" defaultValue={value} />
  ),
};

function submit(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  return AIO.Schema.partial().parse(raw);
}
export default GenericInputTable(Components, AIO.Label, submit);
