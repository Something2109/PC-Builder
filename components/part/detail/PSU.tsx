import PSU from "@/utils/interface/part/PSU";
import { FunctionComponent } from "react";
import { TableRowWrapper, GenericTable } from "../TableWrapper";

const Components: {
  [key in keyof PSU.Info]: FunctionComponent<{ value: PSU.Info[key] }>;
} = {
  wattage: ({ value }) => <TableRowWrapper>Wattage {value}</TableRowWrapper>,
  efficiency: ({ value }) => (
    <TableRowWrapper>Efficiency {value}</TableRowWrapper>
  ),
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  width: ({ value }) => <TableRowWrapper>Width {value}</TableRowWrapper>,
  length: ({ value }) => <TableRowWrapper>Length {value}</TableRowWrapper>,
  height: ({ value }) => <TableRowWrapper>Height {value}</TableRowWrapper>,
  modular: ({ value }) => <TableRowWrapper>Modular {value}</TableRowWrapper>,
  atx_pin: ({ value }) => <TableRowWrapper>ATX Pin {value}</TableRowWrapper>,
  cpu_pin: ({ value }) => <TableRowWrapper>CPU Pin {value}</TableRowWrapper>,
  pcie_pin: ({ value }) => <TableRowWrapper>PCIe Pin {value}</TableRowWrapper>,
  sata_pin: ({ value }) => <TableRowWrapper>SATA Pin {value}</TableRowWrapper>,
  peripheral_pin: ({ value }) => (
    <TableRowWrapper>Peripheral Pin {value}</TableRowWrapper>
  ),
};

export default GenericTable(Components);
