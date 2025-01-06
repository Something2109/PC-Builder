import Radiator from "@/utils/interface/part/Radiator";
import {
  TableRowWrapper,
  TableWrapper,
  DimensionTableRow,
} from "../TableWrapper";
import { TableHTMLAttributes } from "react";

export function RadiatorTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Radiator.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>
        Form Factor
        {defaultValue?.form_factor}
      </TableRowWrapper>
      <DimensionTableRow defaultValue={defaultValue} />
      <TableRowWrapper>
        FPI
        {defaultValue?.fpi}
      </TableRowWrapper>
      <TableRowWrapper>
        Material
        {defaultValue?.material}
      </TableRowWrapper>
    </TableWrapper>
  );
}
