import {
  DimensionTableRowWrapper,
  TableRowWrapper,
  TableWrapper,
} from "./utils";
import Fan from "@/utils/interface/part/Fan";
import { TableHTMLAttributes } from "react";

export function FanTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Fan.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>Form Factor {defaultValue?.form_factor}</TableRowWrapper>
      <DimensionTableRowWrapper defaultValue={defaultValue} />
      <TableRowWrapper>Voltage {defaultValue?.voltage}</TableRowWrapper>
      <TableRowWrapper>Speed {defaultValue?.speed}</TableRowWrapper>
      <TableRowWrapper>Airflow {defaultValue?.airflow}</TableRowWrapper>
      <TableRowWrapper>Noise {defaultValue?.noise}</TableRowWrapper>
      <TableRowWrapper>
        Static Pressure {defaultValue?.static_pressure}
      </TableRowWrapper>
      <TableRowWrapper>Form Factor {defaultValue?.bearing}</TableRowWrapper>
    </TableWrapper>
  );
}
