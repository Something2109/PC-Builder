import CPUBlock from "@/utils/interface/part/CPUBlock";
import { TableRowWrapper, TableWrapper } from "../TableWrapper";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof CPUBlock.Info]: FunctionComponent<{
    value: CPUBlock.Info[key];
  }>;
} = {
  socket: ({ value }) => (
    <TableRowWrapper>Socket {value.join(", ")}</TableRowWrapper>
  ),
  plate: ({ value }) => <TableRowWrapper>Plate {value}</TableRowWrapper>,
  rgb: ({ value }) => <TableRowWrapper>RGB {value}</TableRowWrapper>,
};

export function CPUBlockTable({
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
