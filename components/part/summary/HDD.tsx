import { SuffixDisplay } from "@/components/utils/Display";
import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import HDD from "@/utils/interface/info/HDD";

const Components: InfoSummaryMapping<HDD.Info, HDD.Summarizable> = {
  capacity: ({ value }) => <SuffixDisplay suffix="GB">{value}</SuffixDisplay>,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  HDD.Label,
  HDD.SummaryAttributes
);
