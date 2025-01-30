import { TableWrapper, TableRowWrapper, InputRow } from "../TableWrapper";
import { Input } from "@/components/utils/Input";
import CPU from "@/utils/interface/part/CPU";
import { FunctionComponent, ReactNode, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof CPU.Info]: FunctionComponent<{ value: CPU.Info[key] }>;
} = {
  family: ({ value }) => (
    <InputRow name="family" label="Family" defaultValue={value} />
  ),
  socket: ({ value }) => (
    <InputRow name="socket" label="Socket" defaultValue={value} />
  ),
  total_cores: ({ value }) => (
    <InputRow
      type="number"
      name="total_cores"
      label="Total Cores"
      defaultValue={value}
    />
  ),
  total_threads: ({ value }) => (
    <InputRow
      type="number"
      name="total_threads"
      label="Total Threads"
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
  turbo_frequency: ({ value }) => (
    <InputRow
      type="number"
      name="turbo_frequency"
      label="Turbo Frequency"
      defaultValue={value}
    />
  ),
  cores: ({ value }) => <></>,
  L2_cache: ({ value }) => (
    <InputRow
      type="number"
      name="L2_cache"
      label="L2 Cache"
      defaultValue={value}
    />
  ),
  L3_cache: ({ value }) => (
    <InputRow
      type="number"
      name="L3_cache"
      label="L3 Cache"
      defaultValue={value}
    />
  ),
  max_memory: ({ value }) => (
    <InputRow
      type="number"
      name="max_memory"
      label="Max Memory Support"
      defaultValue={value}
    />
  ),
  max_memory_channel: ({ value }) => (
    <InputRow
      type="number"
      name="max_memory_channel"
      label="Max Memory Channel Support"
      defaultValue={value}
    />
  ),
  max_memory_bandwidth: ({ value }) => (
    <InputRow
      type="number"
      name="max_memory_bandwidth"
      label="Max Memory Bandwidth"
      defaultValue={value}
    />
  ),
  tdp: ({ value }) => (
    <InputRow type="number" name="tdp" label="TDP" defaultValue={value} />
  ),
  lithography: ({ value }) => (
    <InputRow name="lithography" label="Lithography" defaultValue={value} />
  ),
};

export default function CPUFieldset({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<CPU.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">): ReactNode {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof CPU.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
