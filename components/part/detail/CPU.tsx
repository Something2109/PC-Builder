import CPU from "@/utils/interface/part/CPU";
import { TableRowWrapper } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof CPU.Info]: FunctionComponent<{ value: CPU.Info[key] }>;
} = {
  family: ({ value }) => <TableRowWrapper>Family {value}</TableRowWrapper>,
  socket: ({ value }) => <TableRowWrapper>Socket {value}</TableRowWrapper>,
  total_cores: ({ value }) => (
    <TableRowWrapper>Total Cores {value}</TableRowWrapper>
  ),
  total_threads: ({ value }) => (
    <TableRowWrapper>Total Threads {value}</TableRowWrapper>
  ),
  base_frequency: ({ value }) => (
    <TableRowWrapper>Base Frequency {value}</TableRowWrapper>
  ),
  turbo_frequency: ({ value }) => (
    <TableRowWrapper>Turbo Frequency {value}</TableRowWrapper>
  ),
  cores: ({ value }) => (
    <TableRowWrapper>Core Type {value.toString()}</TableRowWrapper>
  ),
  L2_cache: ({ value }) => <TableRowWrapper>L2 Cache {value}</TableRowWrapper>,
  L3_cache: ({ value }) => <TableRowWrapper>L3 Cache {value}</TableRowWrapper>,
  max_memory: ({ value }) => (
    <TableRowWrapper>Max Memory Support {value}</TableRowWrapper>
  ),
  max_memory_channel: ({ value }) => (
    <TableRowWrapper>Max Memory Channel Support {value}</TableRowWrapper>
  ),
  max_memory_bandwidth: ({ value }) => (
    <TableRowWrapper>Max Memory Bandwidth {value}</TableRowWrapper>
  ),
  tdp: ({ value }) => <TableRowWrapper>TDP {value}</TableRowWrapper>,
  lithography: ({ value }) => (
    <TableRowWrapper>Lithography {value}</TableRowWrapper>
  ),
};

export { Components as CPUComponents };
