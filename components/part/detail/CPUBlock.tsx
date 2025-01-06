import CPUBlock from "@/utils/interface/part/CPUBlock";
import { TableRowWrapper, TableWrapper } from "../TableWrapper";
import { TableHTMLAttributes } from "react";

export function CPUBlockTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<CPUBlock.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>
        Socket {defaultValue?.socket?.join(", ")}
      </TableRowWrapper>
      <TableRowWrapper>
        Plate
        {defaultValue?.plate}
      </TableRowWrapper>
      <TableRowWrapper>
        RGB
        {defaultValue?.rgb}
      </TableRowWrapper>
    </TableWrapper>
  );
}
