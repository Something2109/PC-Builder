import { Table, TableRowWrapper } from "../TableWrapper";
import Mainboard from "@/utils/interface/part/Mainboard";
import { InternalConnectors } from "@/utils/interface/utils";
import { FunctionComponent } from "react";

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
  pcies: ({ value }) => <PCIeTableRow defaultValue={value} />,
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

const PCIeControllerName: {
  [key in InternalConnectors.PCIe.Controller]: string;
} = {
  cpu: "CPU",
  chipset: "Chipset",
};

function PCIeTableRow({ defaultValue }: { defaultValue?: Mainboard.PCIe }) {
  if (!defaultValue) return undefined;

  return Object.entries(PCIeControllerName).map(([key, label], index, arr) => {
    const value = defaultValue[key as InternalConnectors.PCIe.Controller];
    if (!value) return undefined;

    const tableValues = Object.entries(value)
      .map(([key, value]) => `${value} * ${key}`)
      .join(", ");

    return (
      <Table.Row key={new Date().getTime() + index}>
        {index === 0 && (
          <Table.Cell rowSpan={arr.length}>PCIe Slots</Table.Cell>
        )}
        <Table.Cell className="font-bold">{label}</Table.Cell>
        <Table.Cell>{tableValues}</Table.Cell>
      </Table.Row>
    );
  });
}

export { Components as MainboardComponents };
