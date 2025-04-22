import CPU from "@/utils/interface/part/product/CPU";
import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";

const Components: InfoSummaryMapping<CPU.Summary> = {
  socket: ({ value }) => value,
  total_cores: ({ value }) => value,
  total_threads: ({ value }) => value,
  base_frequency: ({ value }) => (
    <SuffixDisplay suffix="GHz">{value}</SuffixDisplay>
  ),
  turbo_frequency: ({ value }) => (
    <SuffixDisplay suffix="GHz">{value}</SuffixDisplay>
  ),
  tdp: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
};

export default GenericSummaryCells(
  Components,
  CPU.AttributeLabels,
  CPU.Summary.keyof().options
);
