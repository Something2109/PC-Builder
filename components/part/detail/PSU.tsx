import PSU from "@/utils/interface/part/PSU";
import { TableHTMLAttributes } from "react";
import {
  DimensionTableRowWrapper,
  TableRowWrapper,
  TableWrapper,
} from "./utils";

export function PSUTable({
  defaultValue,
  ...rest
}: {
  defaultValue?: Partial<PSU.Info>;
} & Omit<TableHTMLAttributes<HTMLTableElement>, "defaultValue">) {
  return (
    <TableWrapper {...rest}>
      <TableRowWrapper>Wattage {defaultValue?.wattage}</TableRowWrapper>
      <TableRowWrapper>Efficiency {defaultValue?.efficiency}</TableRowWrapper>
      <TableRowWrapper>Form Factor {defaultValue?.form_factor}</TableRowWrapper>
      <DimensionTableRowWrapper defaultValue={defaultValue} />
      <TableRowWrapper>Modular {defaultValue?.modular}</TableRowWrapper>
      <TableRowWrapper>ATX Pin {defaultValue?.atx_pin}</TableRowWrapper>
      <TableRowWrapper>CPU Pin {defaultValue?.cpu_pin}</TableRowWrapper>
      <TableRowWrapper>PCIe Pin {defaultValue?.pcie_pin}</TableRowWrapper>
      <TableRowWrapper>SATA Pin {defaultValue?.sata_pin}</TableRowWrapper>
      <TableRowWrapper>
        Peripheral Pin {defaultValue?.peripheral_pin}
      </TableRowWrapper>
    </TableWrapper>
  );
}
