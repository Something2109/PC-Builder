import { Table, TableRowWrapper, GenericTable } from "../TableWrapper";
import Case from "@/utils/interface/part/Case";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Case.Info]: FunctionComponent<{ value: Case.Info[key] }>;
} = {
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  width: ({ value }) => <TableRowWrapper>Width {value}</TableRowWrapper>,
  length: ({ value }) => <TableRowWrapper>Length {value}</TableRowWrapper>,
  height: ({ value }) => <TableRowWrapper>Height {value}</TableRowWrapper>,
  mainboard_support: ({ value }) => (
    <TableRowWrapper>Mainboard Support {value.join(", ")}</TableRowWrapper>
  ),
  expansion_slot: ({ value }) => (
    <TableRowWrapper>Expansion Slot {value}</TableRowWrapper>
  ),
  max_cooler_height: ({ value }) => (
    <TableRowWrapper>Max Cooler Support {value}</TableRowWrapper>
  ),
  radiator_support: ({ value }) => (
    <CaseSideTableRow label={"Radiator Support"} defaultValue={value} />
  ),
  fan_support: ({ value }) => (
    <CaseSideTableRow label={"Fan Support"} defaultValue={value} />
  ),
  hard_drive_support: ({ value }) => (
    <CaseSideTableRow label={"Hard Drive Support"} defaultValue={value} />
  ),
  psu_support: ({ value }) => (
    <TableRowWrapper>PSU Support {value.join(", ")}</TableRowWrapper>
  ),
  max_psu_length: ({ value }) => (
    <TableRowWrapper>Max PSU Length {value}</TableRowWrapper>
  ),
  front_panel_ports: ({ value }) => (
    <TableRowWrapper>
      Front Panel Ports
      {Object.entries(value)
        .map(([key, count]) => `${count} * ${key}`)
        .join(", ")}
    </TableRowWrapper>
  ),
};

export function CaseSideTableRow({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: Case.FanSupport | Case.RadiatorSupport | Case.HardDriveSupport;
}) {
  if (!defaultValue) return undefined;

  return Object.entries(defaultValue).map(([key, value], index, arr) => {
    const tableValues = Array.isArray({ value })
      ? value.join(", ")
      : Object.entries(value)
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

export default GenericTable(Components);
