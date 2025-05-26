import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";
import GPU from "@/utils/interface/part/product/GPU";

const Components: InfoSummaryMapping<GPU.Summary> = {
  core_count: ({ value }) => value,
  base_frequency: ({ value }) => (
    <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>
  ),
  boost_frequency: ({ value }) => (
    <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>
  ),
  memory_size: ({ value }) => (
    <SuffixDisplay suffix="GB">{value}</SuffixDisplay>
  ),
  tdp: ({ value }) => <SuffixDisplay suffix="W">{value}</SuffixDisplay>,
};

export default GenericSummaryCells(
  Components,
  GPU.AttributeLabels,
  GPU.Summary.keyof().options
);
