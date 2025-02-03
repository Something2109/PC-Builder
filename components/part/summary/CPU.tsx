import CPU from "@/utils/interface/part/CPU";
import { GenericSummaryCells } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in CPU.Summarizable]: FunctionComponent<{ value?: CPU.Info[key] }>;
} = {
  socket: ({ value }) => value,
  total_cores: ({ value }) => value,
  total_threads: ({ value }) => value,
  base_frequency: ({ value }) => value,
  turbo_frequency: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  CPU.Label,
  CPU.SummaryAttributes
);
