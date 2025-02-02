import { TableRowWrapper, GenericTable } from "../TableWrapper";
import SSD from "@/utils/interface/part/SSD";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof SSD.Info]: FunctionComponent<{ value: SSD.Info[key] }>;
} = {
  memory_type: ({ value }) => (
    <TableRowWrapper>Memory Type {value}</TableRowWrapper>
  ),
  read_speed: ({ value }) => (
    <TableRowWrapper>Read Speed {value}</TableRowWrapper>
  ),
  write_speed: ({ value }) => (
    <TableRowWrapper>Write Speed {value}</TableRowWrapper>
  ),
  capacity: ({ value }) => <TableRowWrapper>Capacity {value}</TableRowWrapper>,
  cache: ({ value }) => <TableRowWrapper>Cache {value}</TableRowWrapper>,
  tbw: ({ value }) => <TableRowWrapper>TBW {value}</TableRowWrapper>,
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  interface: ({ value }) => (
    <TableRowWrapper>Interface {value}</TableRowWrapper>
  ),
};

export default GenericTable(Components);
