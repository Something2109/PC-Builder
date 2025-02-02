import CPUBlock from "@/utils/interface/part/CPUBlock";
import { InternalConnectors, Material } from "@/utils/interface/utils";
import { Input, OptionSelect } from "@/components/utils/Input";
import { GenericInputTable } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof CPUBlock.Info]: FunctionComponent<{
    value?: CPUBlock.Info[key];
  }>;
} = {
  socket: ({ value }) => <Input name="socket" defaultValue={value} />,
  plate: ({ value }) => (
    <OptionSelect
      name="plate"
      options={Material.Metal.options}
      defaultValue={value}
    />
  ),
  rgb: ({ value }) => (
    <OptionSelect
      name="rgb"
      options={InternalConnectors.RGB.options}
      defaultValue={value}
    />
  ),
};

export default GenericInputTable(Components, CPUBlock.Label);
