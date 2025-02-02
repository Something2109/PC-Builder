import PSU from "@/utils/interface/part/PSU";
import { FunctionComponent } from "react";
import { GenericTable } from "../TableWrapper";

const Components: {
  [key in keyof PSU.Info]: FunctionComponent<{ value: PSU.Info[key] }>;
} = {
  wattage: ({ value }) => value,
  efficiency: ({ value }) => value,
  form_factor: ({ value }) => value,
  width: ({ value }) => value,
  length: ({ value }) => value,
  height: ({ value }) => value,
  modular: ({ value }) => value,
  atx_pin: ({ value }) => value,
  cpu_pin: ({ value }) => value,
  pcie_pin: ({ value }) => value,
  sata_pin: ({ value }) => value,
  peripheral_pin: ({ value }) => value,
};

export default GenericTable(Components, PSU.Label);
