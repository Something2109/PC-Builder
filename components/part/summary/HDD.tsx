import { SuffixDisplay } from "@/components/utils/Display";
import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import HDD from "@/utils/interface/part/product/HDD";

const Components: InfoSummaryMapping<HDD.Summary> = {
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
  read_speed: ({ value }) => (
    <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>
  ),
  write_speed: ({ value }) => (
    <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>
  ),
};

export default GenericSummaryCells(
  Components,
  HDD.AttributeLabels,
  HDD.Summary.keyof().options
);
