import { TableRowWrapper } from "../TableWrapper";
import Cooler from "@/utils/interface/part/Cooler";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Cooler.Info]: FunctionComponent<{ value: Cooler.Info[key] }>;
} = {
  socket: ({ value }) => <TableRowWrapper>Socket {value}</TableRowWrapper>,
  cpu_plate: ({ value }) => (
    <TableRowWrapper>CPU Plate {value}</TableRowWrapper>
  ),
  width: ({ value }) => <TableRowWrapper>Width {value}</TableRowWrapper>,
  length: ({ value }) => <TableRowWrapper>Length {value}</TableRowWrapper>,
  height: ({ value }) => <TableRowWrapper>Height {value}</TableRowWrapper>,
};

export { Components as CoolerComponents };
