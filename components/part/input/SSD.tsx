import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import SSD from "@/utils/interface/info/SSD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof SSD.Info]: FunctionComponent<{ value?: SSD.Info[key] }>;
} = {
  memory_type: ({ value }) => (
    <OptionSelect
      name="memory_type"
      options={SSD.MemoryCell.options}
      defaultValue={value}
    />
  ),
  read_speed: ({ value }) => (
    <Input type="number" name="read_speed" defaultValue={value} />
  ),
  write_speed: ({ value }) => (
    <Input type="number" name="write_speed" defaultValue={value} />
  ),
  capacity: ({ value }) => (
    <Input type="number" name="capacity" defaultValue={value} />
  ),
  cache: ({ value }) => (
    <Input type="number" name="cache" defaultValue={value} />
  ),
  tbw: ({ value }) => <Input type="number" name="tbw" defaultValue={value} />,
  form_factor: ({ value }) => (
    <OptionSelect
      name="form_factor"
      options={FormFactor.SSD.options}
      defaultValue={value}
    />
  ),
  interface: ({ value }) => (
    <OptionSelect
      name="interface"
      options={InternalConnectors.Storage.SSD.options}
      defaultValue={value}
    />
  ),
};

export default GenericInputTable(Components, SSD.Label);
