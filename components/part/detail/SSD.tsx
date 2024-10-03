import { TableRowWrapper, TableWrapper } from "./utils";
import SSD from "@/utils/interface/part/SSD";
import { TableHTMLAttributes } from "react";

export function SSDTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<SSD.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>
        Rotational Speed {defaultValue?.memory_type}
      </TableRowWrapper>
      <TableRowWrapper>Read Speed {defaultValue?.read_speed}</TableRowWrapper>
      <TableRowWrapper>Write Speed {defaultValue?.write_speed}</TableRowWrapper>
      <TableRowWrapper>Capacity {defaultValue?.capacity}</TableRowWrapper>
      <TableRowWrapper>Cache {defaultValue?.cache}</TableRowWrapper>
      <TableRowWrapper>TBW {defaultValue?.tbw}</TableRowWrapper>
      <TableRowWrapper>Form Factor {defaultValue?.form_factor}</TableRowWrapper>
      <TableRowWrapper>Protocol {defaultValue?.protocol}</TableRowWrapper>
      <TableRowWrapper>Interface {defaultValue?.interface}</TableRowWrapper>
    </TableWrapper>
  );
}
