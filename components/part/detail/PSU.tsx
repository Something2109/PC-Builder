import PSU from "@/utils/interface/info/PSU";
import { FunctionComponent } from "react";
import { GenericDetailTable } from "../TableWrapper";

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

export default GenericDetailTable(Components, PSU.Label);
