import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";
import SSD from "@/utils/interface/info/SSD";

const Components: InfoSummaryMapping<SSD.Info, SSD.Summarizable> = {
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
  SSD.Label,
  SSD.SummaryAttributes
);
