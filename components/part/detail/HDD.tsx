import { TableRowWrapper } from "../TableWrapper";
import HDD from "@/utils/interface/part/HDD";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof HDD.Info]: FunctionComponent<{ value: HDD.Info[key] }>;
} = {
  rotational_speed: ({ value }) => (
    <TableRowWrapper>Rotational Speed {value}</TableRowWrapper>
  ),
  read_speed: ({ value }) => (
    <TableRowWrapper>Read Speed {value}</TableRowWrapper>
  ),
  write_speed: ({ value }) => (
    <TableRowWrapper>Write Speed {value}</TableRowWrapper>
  ),
  capacity: ({ value }) => <TableRowWrapper>Capacity {value}</TableRowWrapper>,
  cache: ({ value }) => <TableRowWrapper>Cache {value}</TableRowWrapper>,
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  interface: ({ value }) => (
    <TableRowWrapper>Interface {value}</TableRowWrapper>
  ),
};

export { Components as HDDComponents };
