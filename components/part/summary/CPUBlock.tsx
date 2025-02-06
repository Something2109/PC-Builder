import CPUBlock from "@/utils/interface/info/CPUBlock";
import { GenericSummaryCells } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in CPUBlock.Summarizable]: FunctionComponent<{
    value?: CPUBlock.Info[key];
  }>;
} = {
  socket: ({ value }) => value?.join(", "),
  plate: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  CPUBlock.Label,
  CPUBlock.SummaryAttributes
);
