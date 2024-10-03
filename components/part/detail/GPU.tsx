import { TableRowWrapper, TableWrapper } from "./utils";
import GPU from "@/utils/interface/part/GPU";
import { TableHTMLAttributes } from "react";

export function GPUTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<GPU.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>Family {defaultValue?.family}</TableRowWrapper>
      <TableRowWrapper>Core Count {defaultValue?.core_count}</TableRowWrapper>
      <TableRowWrapper>
        Execution Unit {defaultValue?.execution_unit}
      </TableRowWrapper>
      <TableRowWrapper>
        Base Frequency {defaultValue?.base_frequency}
      </TableRowWrapper>
      <TableRowWrapper>
        Boost Frequency {defaultValue?.boost_frequency}
      </TableRowWrapper>
      <TableRowWrapper>
        Extra Cores {defaultValue?.extra_cores?.toString()}
      </TableRowWrapper>
      <TableRowWrapper>Memory Size {defaultValue?.memory_size}</TableRowWrapper>
      <TableRowWrapper>
        Memory Type {defaultValue?.memory_type?.toString()}
      </TableRowWrapper>
      <TableRowWrapper>Memory Bus {defaultValue?.memory_bus}</TableRowWrapper>
      <TableRowWrapper>TDP {defaultValue?.tdp}</TableRowWrapper>
      <TableRowWrapper>
        Features {defaultValue?.features?.toString()}
      </TableRowWrapper>
    </TableWrapper>
  );
}
