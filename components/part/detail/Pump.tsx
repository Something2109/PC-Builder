import Pump from "@/utils/interface/part/Pump";
import {
  TableRowWrapper,
  TableWrapper,
  DimensionTableRow,
} from "../TableWrapper";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof Pump.Info]: FunctionComponent<{ value: Pump.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  width: ({ value }) => <TableRowWrapper>Width {value}</TableRowWrapper>,
  length: ({ value }) => <TableRowWrapper>Length {value}</TableRowWrapper>,
  height: ({ value }) => <TableRowWrapper>Height {value}</TableRowWrapper>,
  voltage: ({ value }) => <TableRowWrapper>Voltage {value}</TableRowWrapper>,
  wattage: ({ value }) => <TableRowWrapper>Wattage {value}</TableRowWrapper>,
  head_pressure: ({ value }) => (
    <TableRowWrapper>Head Pressure {value}</TableRowWrapper>
  ),
  flow_rate: ({ value }) => (
    <TableRowWrapper>Flow Rate {value}</TableRowWrapper>
  ),
  power_connector: ({ value }) => (
    <TableRowWrapper>Power Connector {value}</TableRowWrapper>
  ),
  control_connector: ({ value }) => (
    <TableRowWrapper>Control Connector {value}</TableRowWrapper>
  ),
  rgb: ({ value }) => <TableRowWrapper>RGB {value}</TableRowWrapper>,
};

export function PumpTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Pump.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof Pump.Info];

        if (!value || !Component) return undefined;

        return <Component value={value as never} />;
      })}
    </TableWrapper>
  );
}
