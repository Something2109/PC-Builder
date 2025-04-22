import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";
import SSD from "@/utils/interface/part/product/SSD";

const Components: InfoSummaryMapping<SSD.Summary> = {
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  read_speed: ({ value }) => (
    <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>
  ),
  write_speed: ({ value }) => (
    <SuffixDisplay suffix="MB/s">{value}</SuffixDisplay>
  ),
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  SSD.AttributeLabels,
  SSD.Summary.keyof().options
);
