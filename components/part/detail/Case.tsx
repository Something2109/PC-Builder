import {
  DimensionTableRowWrapper,
  TableRowWrapper,
  TableWrapper,
} from "./utils";
import Case from "@/utils/interface/part/Case";
import { TableHTMLAttributes } from "react";

export function CaseTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Case.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>
        Form Factor
        {defaultValue?.form_factor}
      </TableRowWrapper>
      <DimensionTableRowWrapper defaultValue={defaultValue} />
      <TableRowWrapper>
        I/O Ports {defaultValue?.io_ports?.toString()}
      </TableRowWrapper>
      <TableRowWrapper>
        Mainboard Support
        {defaultValue?.mb_support}
      </TableRowWrapper>
      <TableRowWrapper>
        Expansion Slot
        {defaultValue?.expansion_slot}
      </TableRowWrapper>
      <TableRowWrapper>
        AIO Support {defaultValue?.aio_support?.toString()}{" "}
      </TableRowWrapper>
      <TableRowWrapper>
        Fan Support {defaultValue?.fan_support?.toString()}{" "}
      </TableRowWrapper>
      <TableRowWrapper>
        Max Cooler Support
        {defaultValue?.max_cooler_height}
      </TableRowWrapper>
      <TableRowWrapper>
        PSU Support
        {defaultValue?.psu_support}
      </TableRowWrapper>
      <TableRowWrapper>
        Max PSU Length
        {defaultValue?.max_psu_length}
      </TableRowWrapper>
    </TableWrapper>
  );
}
