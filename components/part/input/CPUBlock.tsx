import CPUBlock from "@/utils/interface/part/CPUBlock";
import { InternalConnectors, Material } from "@/utils/interface/utils";
import { InputRow, SelectInputRow, GenericTable } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof CPUBlock.Info]: FunctionComponent<{
    value: CPUBlock.Info[key];
  }>;
} = {
  socket: ({ value }) => (
    <InputRow name="socket" label="Socket" defaultValue={value} />
  ),
  plate: ({ value }) => (
    <SelectInputRow
      name="plate"
      label="Plate"
      options={Material.Metal.options}
      defaultValue={value}
    />
  ),
  rgb: ({ value }) => (
    <SelectInputRow
      name="rgb"
      label="RGB"
      options={InternalConnectors.RGB.options}
      defaultValue={value}
    />
  ),
};

export default GenericTable(Components);
