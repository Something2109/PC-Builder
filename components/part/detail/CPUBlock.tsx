import CPUBlock from "@/utils/interface/part/CPUBlock";
import { GenericDetailTable } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof CPUBlock.Info]: FunctionComponent<{
    value: CPUBlock.Info[key];
  }>;
} = {
  socket: ({ value }) => value.join(", "),
  plate: ({ value }) => value,
  rgb: ({ value }) => value,
};

export default GenericDetailTable(Components, CPUBlock.Label);
