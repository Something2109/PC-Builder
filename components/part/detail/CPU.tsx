import CPU from "@/utils/interface/part/CPU";
import { TableRowWrapper, TableWrapper } from "./utils";

import { TableHTMLAttributes } from "react";

export function CPUTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<CPU.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>Family {defaultValue?.family}</TableRowWrapper>
      <TableRowWrapper>Socket {defaultValue?.socket}</TableRowWrapper>
      <TableRowWrapper>
        Total Cores
        {defaultValue?.total_cores}
      </TableRowWrapper>
      <TableRowWrapper>
        Total Threads
        {defaultValue?.total_threads}
      </TableRowWrapper>
      <TableRowWrapper>
        Base Frequency
        {defaultValue?.base_frequency}
      </TableRowWrapper>
      <TableRowWrapper>
        Turbo Frequency
        {defaultValue?.turbo_frequency}
      </TableRowWrapper>
      <TableRowWrapper>
        Core Type
        {defaultValue?.cores?.toString()}
      </TableRowWrapper>
      <TableRowWrapper>
        L2 Cache
        {defaultValue?.L2_cache}
      </TableRowWrapper>
      <TableRowWrapper>
        L3 Cache
        {defaultValue?.L3_cache}
      </TableRowWrapper>
      <TableRowWrapper>
        Max Memory Support
        {defaultValue?.max_memory}
      </TableRowWrapper>
      <TableRowWrapper>
        Max Memory Channel Support
        {defaultValue?.max_memory_channel}
      </TableRowWrapper>
      <TableRowWrapper>
        Max Memory Bandwidth
        {defaultValue?.max_memory_bandwidth}
      </TableRowWrapper>
      <TableRowWrapper>TDP {defaultValue?.tdp}</TableRowWrapper>
      <TableRowWrapper>
        Lithography
        {defaultValue?.lithography}
      </TableRowWrapper>
    </TableWrapper>
  );
}
