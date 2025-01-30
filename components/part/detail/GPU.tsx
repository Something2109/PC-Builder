import { TableRowWrapper, TableWrapper } from "../TableWrapper";
import GPU from "@/utils/interface/part/GPU";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof GPU.Info]: FunctionComponent<{ value: GPU.Info[key] }>;
} = {
  family: ({ value }) => <TableRowWrapper>Family {value}</TableRowWrapper>,
  core_count: ({ value }) => (
    <TableRowWrapper>Core Count {value}</TableRowWrapper>
  ),
  execution_unit: ({ value }) => (
    <TableRowWrapper>Execution Unit {value}</TableRowWrapper>
  ),
  base_frequency: ({ value }) => (
    <TableRowWrapper>Base Frequency {value}</TableRowWrapper>
  ),
  boost_frequency: ({ value }) => (
    <TableRowWrapper>Boost Frequency {value}</TableRowWrapper>
  ),
  extra_cores: ({ value }) => (
    <TableRowWrapper>Extra Cores {value.toString()}</TableRowWrapper>
  ),
  memory_size: ({ value }) => (
    <TableRowWrapper>Memory Size {value}</TableRowWrapper>
  ),
  memory_type: ({ value }) => (
    <TableRowWrapper>Memory Type {value.toString()}</TableRowWrapper>
  ),
  memory_bus: ({ value }) => (
    <TableRowWrapper>Memory Bus {value}</TableRowWrapper>
  ),
  tdp: ({ value }) => <TableRowWrapper>TDP {value}</TableRowWrapper>,
  features: ({ value }) => (
    <TableRowWrapper>Features {value.toString()}</TableRowWrapper>
  ),
};

export function GPUTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<GPU.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof GPU.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
