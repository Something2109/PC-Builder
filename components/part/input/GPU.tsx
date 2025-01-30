import { TableWrapper, InputRow } from "../TableWrapper";
import GPU from "@/utils/interface/part/GPU";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof GPU.Info]: FunctionComponent<{ value: GPU.Info[key] }>;
} = {
  family: ({ value }) => (
    <InputRow name="family" label="Family" defaultValue={value} />
  ),
  core_count: ({ value }) => (
    <InputRow
      type="number"
      name="core_count"
      label="Core Count"
      defaultValue={value}
    />
  ),
  execution_unit: ({ value }) => (
    <InputRow
      type="number"
      name="execution_unit"
      label="Execution Unit"
      defaultValue={value}
    />
  ),
  base_frequency: ({ value }) => (
    <InputRow
      type="number"
      name="base_frequency"
      label="Base Frequency"
      defaultValue={value}
    />
  ),
  boost_frequency: ({ value }) => (
    <InputRow
      type="number"
      name="boost_frequency"
      label="Boost Frequency"
      defaultValue={value}
    />
  ),
  extra_cores: ({ value }) => <></>,
  memory_size: ({ value }) => (
    <InputRow
      type="number"
      name="memory_size"
      label="Memory Size"
      defaultValue={value}
    />
  ),
  memory_type: ({ value }) => (
    <InputRow name="memory_type" label="Memory Type" defaultValue={value} />
  ),
  memory_bus: ({ value }) => (
    <InputRow
      type="number"
      name="memory_bus"
      label="Memory Bus"
      defaultValue={value}
    />
  ),
  tdp: ({ value }) => (
    <InputRow type="number" name="tdp" label="TDP" defaultValue={value} />
  ),
  features: ({ value }) => <></>,
};

export default function GPUFieldset({
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
