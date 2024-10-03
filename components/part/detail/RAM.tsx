import RAM from "@/utils/interface/part/RAM";
import { TableHTMLAttributes } from "react";
import { TableRowWrapper, TableWrapper } from "./utils";

export function RAMTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<RAM.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>Speed {defaultValue?.speed}</TableRowWrapper>
      <TableRowWrapper>Capacity {defaultValue?.capacity}</TableRowWrapper>
      <TableRowWrapper>Voltage {defaultValue?.voltage}</TableRowWrapper>
      <TableRowWrapper>
        Latency {defaultValue?.latency?.toString()}
      </TableRowWrapper>
      <TableRowWrapper>RAM Kit {defaultValue?.kit}</TableRowWrapper>
      <TableRowWrapper>Form Factor {defaultValue?.form_factor}</TableRowWrapper>
      <TableRowWrapper>Protocol {defaultValue?.protocol}</TableRowWrapper>
    </TableWrapper>
  );
}
