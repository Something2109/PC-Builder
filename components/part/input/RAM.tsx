import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import RAM from "@/utils/interface/part/RAM";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof RAM.Info]: FunctionComponent<{ value?: RAM.Info[key] }>;
} = {
  speed: ({ value }) => (
    <Input type="number" name="speed" defaultValue={value} />
  ),
  capacity: ({ value }) => (
    <Input type="number" name="capacity" defaultValue={value} />
  ),
  voltage: ({ value }) => (
    <Input type="number" name="voltage" defaultValue={value} />
  ),
  latency: ({ value }) => <></>,
  kit: ({ value }) => <Input type="number" name="kit" defaultValue={value} />,
  form_factor: ({ value }) => (
    <OptionSelect
      name="form_factor"
      options={FormFactor.RAM.options}
      defaultValue={value}
    />
  ),
  interface: ({ value }) => (
    <OptionSelect
      name="interface"
      options={InternalConnectors.RAM.options}
      defaultValue={value}
    />
  ),
};

export default GenericInputTable(Components, RAM.Label);
