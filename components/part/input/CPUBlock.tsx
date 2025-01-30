import CPUBlock from "@/utils/interface/part/CPUBlock";
import { InternalConnectors, Material } from "@/utils/interface/utils";
import { TableWrapper, InputRow, SelectInputRow } from "../TableWrapper";
import { FunctionComponent, TableHTMLAttributes } from "react";

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

export default function CPUBlockTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<CPUBlock.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof CPUBlock.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
