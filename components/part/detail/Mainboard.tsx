import { Table, TableRowWrapper } from "../TableWrapper";
import Mainboard from "@/utils/interface/part/Mainboard";
import { FunctionComponent, TableHTMLAttributes } from "react";

const Components: {
  [key in keyof Mainboard.Info]: FunctionComponent<{
    value: Mainboard.Info[key];
  }>;
} = {
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  socket: ({ value }) => <TableRowWrapper>Socket {value}</TableRowWrapper>,
  chipset: ({ value }) => <TableRowWrapper>Chipset {value}</TableRowWrapper>,
  ram_form_factor: ({ value }) => (
    <TableRowWrapper>RAM Form Factor {value}</TableRowWrapper>
  ),
  ram_interface: ({ value }) => (
    <TableRowWrapper>RAM Interface {value}</TableRowWrapper>
  ),
  ram_slot: ({ value }) => <TableRowWrapper>RAM Slot {value}</TableRowWrapper>,
  expansion_slots: ({ value }) => (
    <TableRowWrapper>Expansion Slots {value}</TableRowWrapper>
  ),
  pcies: ({ value }) => (
    <PCIeTableRow label={"PCIe Slots"} defaultValue={value} />
  ),
  power_connectors: ({ value }) => (
    <TableRowWrapper>
      Power Connector
      {Object.entries(value)
        .map(([key, count]) => `${count} * ${key}`)
        .join(", ")}
    </TableRowWrapper>
  ),
  fan_connectors: ({ value }) => (
    <TableRowWrapper>
      Fan Connector
      {Object.entries(value)
        .map(([key, count]) => `${count} * ${key}`)
        .join(", ")}
    </TableRowWrapper>
  ),
  storage_connectors: ({ value }) => (
    <TableRowWrapper>
      Storage Connector
      {Object.entries(value)
        .map(([key, count]) => `${count} * ${key}`)
        .join(", ")}
    </TableRowWrapper>
  ),
  usb_connectors: ({ value }) => (
    <TableRowWrapper>
      USB Connector
      {Object.entries(value)
        .map(([key, count]) => `${count} * ${key}`)
        .join(", ")}
    </TableRowWrapper>
  ),
  miscelanous_connectors: ({ value }) => (
    <TableRowWrapper>
      Other Connector
      {Object.entries(value)
        .map(([key, count]) => `${count} * ${key}`)
        .join(", ")}
    </TableRowWrapper>
  ),
  back_panel_ports: ({ value }) => (
    <TableRowWrapper>
      Back Panel Connector
      {Object.entries(value)
        .map(([key, count]) => `${count} * ${key}`)
        .join(", ")}
    </TableRowWrapper>
  ),
};

export function PCIeTableRow({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: Mainboard.PCIe;
}) {
  if (!defaultValue) return undefined;

  return Object.entries(defaultValue).map(([key, value], index, arr) => {
    const tableValues = Object.entries(value)
      .map(([key, value]) => `${value} * ${key}`)
      .join(", ");

    return (
      <Table.Row key={new Date().getTime() + index}>
        {index === 0 && <Table.Cell rowSpan={arr.length}>{label}</Table.Cell>}
        <Table.Cell className="font-bold">{key}</Table.Cell>
        <Table.Cell>{tableValues}</Table.Cell>
      </Table.Row>
    );
  });
}

export { Components as MainboardComponents };
