import { TableRowWrapper, TableWrapper } from "./utils";
import Mainboard from "@/utils/interface/part/Mainboard";
import { TableHTMLAttributes } from "react";

export function MainboardTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Mainboard.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>Form Factor {defaultValue?.form_factor}</TableRowWrapper>
      <TableRowWrapper>Socket {defaultValue?.socket}</TableRowWrapper>
      <TableRowWrapper>
        RAM Form Factor {defaultValue?.ram_form_factor}
      </TableRowWrapper>
      <TableRowWrapper>
        RAM Protocol {defaultValue?.ram_protocol}
      </TableRowWrapper>
      <TableRowWrapper>RAM Slot {defaultValue?.ram_slot}</TableRowWrapper>
      <TableRowWrapper>
        Expansion Slots {defaultValue?.expansion_slots}
      </TableRowWrapper>
      <TableRowWrapper>
        I/O Ports {defaultValue?.io_ports?.toString()}
      </TableRowWrapper>
    </TableWrapper>
  );
}
