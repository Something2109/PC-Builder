import { GenericSummaryCells } from "../TableWrapper";
import Cooler from "@/utils/interface/part/Cooler";
import { FunctionComponent } from "react";

const Components: {
  [key in Cooler.Summarizable]: FunctionComponent<{
    value?: Cooler.Info[key];
  }>;
} = {
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
  height: ({ value }) => value,
};

export default GenericSummaryCells(Components, Cooler.Label);
