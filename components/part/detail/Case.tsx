import {
  DimensionTableRow,
  Table,
  TableRowWrapper,
  TableWrapper,
} from "../TableWrapper";
import Case from "@/utils/interface/part/Case";
import { TableHTMLAttributes } from "react";

export function CaseTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<Case.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>
        Form Factor
        {defaultValue?.form_factor}
      </TableRowWrapper>
      <DimensionTableRow defaultValue={defaultValue} />
      <TableRowWrapper>
        Mainboard Support
        {defaultValue?.mainboard_support?.join(", ")}
      </TableRowWrapper>
      <TableRowWrapper>
        Expansion Slot
        {defaultValue?.expansion_slot}
      </TableRowWrapper>
      <TableRowWrapper>
        Max Cooler Support
        {defaultValue?.max_cooler_height}
      </TableRowWrapper>
      <CaseSideTableRow
        label={"Radiator Support"}
        defaultValue={defaultValue?.radiator_support}
      />
      <CaseSideTableRow
        label={"Fan Support"}
        defaultValue={defaultValue?.fan_support}
      />
      <CaseSideTableRow
        label={"Hard Drive Support"}
        defaultValue={defaultValue?.hard_drive_support}
      />
      <TableRowWrapper>
        PSU Support
        {defaultValue?.psu_support?.join(", ")}
      </TableRowWrapper>
      <TableRowWrapper>
        Max PSU Length
        {defaultValue?.max_psu_length}
      </TableRowWrapper>
      <TableRowWrapper>
        Front Panel Ports
        {Object.entries(defaultValue?.front_panel_ports ?? {})
          .map(([key, value]) => `${value} * ${key}`)
          .join(", ")}
      </TableRowWrapper>
    </TableWrapper>
  );
}

export function CaseSideTableRow({
  label,
  defaultValue,
}: {
  label: string;
  defaultValue?: Case.FanSupport | Case.RadiatorSupport | Case.HardDriveSupport;
}) {
  if (!defaultValue) return undefined;

  return Object.entries(defaultValue).map(([key, value], index, arr) => {
    const tableValues = Array.isArray(value)
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
