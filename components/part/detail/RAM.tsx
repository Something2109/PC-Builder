import RAM from "@/utils/interface/part/RAM";
import { FunctionComponent } from "react";
import { TableRowWrapper } from "../TableWrapper";

const Components: {
  [key in keyof RAM.Info]: FunctionComponent<{ value: RAM.Info[key] }>;
} = {
  speed: ({ value }) => <TableRowWrapper>Speed {value}</TableRowWrapper>,
  capacity: ({ value }) => <TableRowWrapper>Capacity {value}</TableRowWrapper>,
  voltage: ({ value }) => <TableRowWrapper>Voltage {value}</TableRowWrapper>,
  latency: ({ value }) => (
    <TableRowWrapper>
      Latency {value.map((val) => val.toString()).join(" - ")}
    </TableRowWrapper>
  ),
  kit: ({ value }) => <TableRowWrapper>RAM Kit {value}</TableRowWrapper>,
  form_factor: ({ value }) => (
    <TableRowWrapper>Form Factor {value}</TableRowWrapper>
  ),
  interface: ({ value }) => (
    <TableRowWrapper>Interface {value}</TableRowWrapper>
  ),
};

export { Components as RAMComponents };
