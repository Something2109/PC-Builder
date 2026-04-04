import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";
import { SuffixDisplay } from "@/ui/Display";
import * as SSD from "@/utils/part/product/SSD";

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
