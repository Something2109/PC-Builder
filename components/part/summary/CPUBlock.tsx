import CPUBlock from "@/utils/interface/info/CPUBlock";
import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";

const Components: InfoSummaryMapping<CPUBlock.Info, CPUBlock.Summarizable> = {
  socket: ({ value }) => value?.join(", "),
  plate: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  CPUBlock.Label,
  CPUBlock.SummaryAttributes
);
