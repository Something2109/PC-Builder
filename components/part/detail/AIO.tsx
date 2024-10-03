import { TableRowWrapper, TableWrapper } from "./utils";
import AIO from "@/utils/interface/part/AIO";
import { TableHTMLAttributes } from "react";

export function AIOTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<AIO.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>
        Form Factor
        {defaultValue?.form_factor}
      </TableRowWrapper>
      <TableRowWrapper>Socket {defaultValue?.socket}</TableRowWrapper>
      <TableRowWrapper>CPU Plate {defaultValue?.cpu_plate}</TableRowWrapper>
      <TableRowWrapper>
        Radiator
        <TableWrapper className="w-full">
          <TableRowWrapper>
            Width {defaultValue?.radiator_width}
          </TableRowWrapper>
          <TableRowWrapper>
            Length {defaultValue?.radiator_length}
          </TableRowWrapper>
          <TableRowWrapper>
            Height {defaultValue?.radiator_height}
          </TableRowWrapper>
        </TableWrapper>
      </TableRowWrapper>
      <TableRowWrapper>
        Pump
        <TableWrapper className="w-full">
          <TableRowWrapper>Width {defaultValue?.pump_width}</TableRowWrapper>
          <TableRowWrapper>Length {defaultValue?.pump_length}</TableRowWrapper>
          <TableRowWrapper>Height {defaultValue?.pump_height}</TableRowWrapper>
        </TableWrapper>
      </TableRowWrapper>
    </TableWrapper>
  );
}
