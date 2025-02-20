import CPU from "@/utils/interface/info/CPU";
import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";

const Components: InfoSummaryMapping<CPU.Info, CPU.Summarizable> = {
  socket: ({ value }) => value,
  total_cores: ({ value }) => value,
  total_threads: ({ value }) => value,
  base_frequency: ({ value }) => (
    <SuffixDisplay suffix="GHz">{value}</SuffixDisplay>
  ),
  turbo_frequency: ({ value }) => (
    <SuffixDisplay suffix="GHz">{value}</SuffixDisplay>
  ),
};

export default GenericSummaryCells(
  Components,
  CPU.Label,
  CPU.SummaryAttributes
);
