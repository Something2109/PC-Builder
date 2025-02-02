import { GenericTable } from "../TableWrapper";
import Cooler from "@/utils/interface/part/Cooler";
import { FunctionComponent } from "react";

const Components: {
  [key in keyof Cooler.Info]: FunctionComponent<{ value: Cooler.Info[key] }>;
} = {
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
  width: ({ value }) => value,
  length: ({ value }) => value,
  height: ({ value }) => value,
};

export default GenericTable(Components, Cooler.Label);
