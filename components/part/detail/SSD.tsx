import { TableRowWrapper, TableWrapper } from "../TableWrapper";
import SSD from "@/utils/interface/part/SSD";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof SSD.Info]: FunctionComponent<{ value: SSD.Info[key] }>;
} = {
  memory_type: ({ value }) => (
    <TableRowWrapper>Memory Type {value}</TableRowWrapper>
  ),
  read_speed: ({ value }) => (
    <TableRowWrapper>Read Speed {value}</TableRowWrapper>
  ),
  write_speed: ({ value }) => (
    <TableRowWrapper>Write Speed {value}</TableRowWrapper>
  ),
  capacity: ({ value }) => <TableRowWrapper>Capacity {value}</TableRowWrapper>,
  cache: ({ value }) => <TableRowWrapper>Cache {value}</TableRowWrapper>,
  tbw: ({ value }) => <TableRowWrapper>TBW {value}</TableRowWrapper>,
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  interface: ({ value }) => (
    <TableRowWrapper>Interface {value}</TableRowWrapper>
  ),
};

export function SSDTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<SSD.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof SSD.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
