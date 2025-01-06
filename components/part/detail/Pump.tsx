import Pump from "@/utils/interface/part/Pump";
import {
  TableRowWrapper,
  TableWrapper,
  DimensionTableRow,
} from "../TableWrapper";
import { TableHTMLAttributes } from "react";

export function PumpTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Pump.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>
        Form Factor
        {defaultValue?.form_factor}
      </TableRowWrapper>
      <DimensionTableRow defaultValue={defaultValue} />
      <TableRowWrapper>
        Voltage
        {defaultValue?.voltage}
      </TableRowWrapper>
      <TableRowWrapper>
        Wattage
        {defaultValue?.wattage}
      </TableRowWrapper>
      <TableRowWrapper>
        Head Pressure
        {defaultValue?.head_pressure}
      </TableRowWrapper>
      <TableRowWrapper>
        Flow Rate
        {defaultValue?.flow_rate}
      </TableRowWrapper>
      <TableRowWrapper>
        Power Connector
        {defaultValue?.power_connector}
      </TableRowWrapper>
      <TableRowWrapper>
        Control Connector
        {defaultValue?.control_connector}
      </TableRowWrapper>{" "}
      <TableRowWrapper>
        RGB
        {defaultValue?.rgb}
      </TableRowWrapper>
    </TableWrapper>
  );
}
