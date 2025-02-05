import { GenericInputTable } from "../TableWrapper";
import { Input, OptionSelect } from "@/components/utils/Input";
import HDD from "@/utils/interface/info/HDD";
import { FormFactor, InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof HDD.Info]: FunctionComponent<{ value?: HDD.Info[key] }>;
} = {
  rotational_speed: ({ value }) => (
    <Input type="number" name="rotational_speed" defaultValue={value} />
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
  form_factor: ({ value }) => (
    <OptionSelect
      name="form_factor"
      options={FormFactor.HDD.options}
      defaultValue={value}
    />
  ),
  interface: ({ value }) => (
    <OptionSelect
      name="interface"
      options={InternalConnectors.Storage.HDD.options}
      defaultValue={value}
    />
  ),
};

export default GenericInputTable(Components, HDD.Label);
