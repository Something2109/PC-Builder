import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import GPU from "@/utils/interface/info/GPU";

const Components: InfoSummaryMapping<GPU.Info, GPU.Summarizable> = {
  core_count: ({ value }) => value,
  base_frequency: ({ value }) => value,
  boost_frequency: ({ value }) => value,
  memory_size: ({ value }) => value,
  tdp: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  GPU.Label,
  GPU.SummaryAttributes
);
