import {
  DimensionTableRowWrapper,
  TableRowWrapper,
  TableWrapper,
} from "./utils";
import Cooler from "@/utils/interface/part/Cooler";
import { TableHTMLAttributes } from "react";

export function CoolerTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Cooler.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>Socket {defaultValue?.socket}</TableRowWrapper>
      <TableRowWrapper>CPU Plate {defaultValue?.cpu_plate}</TableRowWrapper>
      <DimensionTableRowWrapper defaultValue={defaultValue} />
    </TableWrapper>
  );
}
