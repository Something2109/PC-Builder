import { TableRowWrapper, TableWrapper } from "../TableWrapper";
import AIO from "@/utils/interface/part/AIO";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof AIO.Info]: FunctionComponent<{ value: AIO.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  socket: ({ value }) => <TableRowWrapper>Socket {value}</TableRowWrapper>,
  cpu_plate: ({ value }) => (
    <TableRowWrapper>CPU Plate {value}</TableRowWrapper>
  ),
  radiator_width: ({ value }) => (
    <TableRowWrapper>Radiator Width {value}</TableRowWrapper>
  ),
  radiator_length: ({ value }) => (
    <TableRowWrapper>Radiator Length {value}</TableRowWrapper>
  ),
  radiator_height: ({ value }) => (
    <TableRowWrapper>Radiator Height {value}</TableRowWrapper>
  ),
  pump_width: ({ value }) => (
    <TableRowWrapper>Pump Width {value}</TableRowWrapper>
  ),
  pump_length: ({ value }) => (
    <TableRowWrapper>Pump Length {value}</TableRowWrapper>
  ),
  pump_height: ({ value }) => (
    <TableRowWrapper>Pump Height {value}</TableRowWrapper>
  ),
  pump_speed: ({ value }) => (
    <TableRowWrapper>Pump Speed {value}</TableRowWrapper>
  ),
};

export function AIOTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<AIO.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      {Object.entries(defaultValue ?? {}).map(([key, value]) => {
        const Component = Components[key as keyof AIO.Info];

        if (!value || !Component) return undefined;

        return Component(value as never);
      })}
    </TableWrapper>
  );
}
