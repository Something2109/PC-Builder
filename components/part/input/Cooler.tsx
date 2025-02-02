import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect, Select } from "@/components/utils/Input";
import Cooler from "@/utils/interface/part/Cooler";
import { Material } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Cooler.Info]: FunctionComponent<{ value?: Cooler.Info[key] }>;
} = {
  socket: ({ value }) => <Input name="socket" defaultValue={value} />,
  cpu_plate: ({ value }) => (
    <OptionSelect
      name="cpu_plate"
      options={Material.Metal.options}
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
};

export default GenericInputTable(Components, Cooler.Label);
