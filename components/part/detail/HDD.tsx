import { TableRowWrapper, TableWrapper } from "./utils";
import HDD from "@/utils/interface/part/HDD";
import { TableHTMLAttributes } from "react";

export function HDDTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<HDD.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>
        Rotational Speed {defaultValue?.rotational_speed}
      </TableRowWrapper>
      <TableRowWrapper>Read Speed {defaultValue?.read_speed}</TableRowWrapper>
      <TableRowWrapper>Write Speed {defaultValue?.write_speed}</TableRowWrapper>
      <TableRowWrapper>Capacity {defaultValue?.capacity}</TableRowWrapper>
      <TableRowWrapper>Cache {defaultValue?.cache}</TableRowWrapper>
      <TableRowWrapper>Form Factor {defaultValue?.form_factor}</TableRowWrapper>
      <TableRowWrapper>Protocol {defaultValue?.protocol}</TableRowWrapper>
      <TableRowWrapper>
        Protocol Version {defaultValue?.protocol_version}
      </TableRowWrapper>
    </TableWrapper>
  );
}
