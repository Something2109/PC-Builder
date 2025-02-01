import CPUBlock from "@/utils/interface/part/CPUBlock";
import { TableRowWrapper } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof CPUBlock.Info]: FunctionComponent<{
    value: CPUBlock.Info[key];
  }>;
} = {
  socket: ({ value }) => (
    <TableRowWrapper>Socket {value.join(", ")}</TableRowWrapper>
  ),
  plate: ({ value }) => <TableRowWrapper>Plate {value}</TableRowWrapper>,
  rgb: ({ value }) => <TableRowWrapper>RGB {value}</TableRowWrapper>,
};

export { Components as CPUBlockComponents };
