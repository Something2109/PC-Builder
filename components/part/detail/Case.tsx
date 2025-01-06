import {
  DimensionTableRow,
  TableRowWrapper,
  TableWrapper,
} from "../TableWrapper";
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
      <DimensionTableRow defaultValue={defaultValue} />
      <TableRowWrapper>
        Mainboard Support
        {defaultValue?.mainboard_support?.join(", ")}
      </TableRowWrapper>
      <TableRowWrapper>
        Expansion Slot
        {defaultValue?.expansion_slot}
      </TableRowWrapper>
      <TableRowWrapper>
        AIO Support {defaultValue?.radiator_support?.toString()}{" "}
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
