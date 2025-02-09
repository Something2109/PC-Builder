import CPU from "@/utils/interface/info/CPU";
import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";

const Components: InfoSummaryMapping<CPU.Info, CPU.Summarizable> = {
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
