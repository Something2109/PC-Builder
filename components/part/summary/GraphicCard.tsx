import { SuffixDisplay } from "@/components/utils/Display";
import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import GraphicCard from "@/utils/interface/info/GraphicCard";

const Components: InfoSummaryMapping<
  GraphicCard.Info,
  GraphicCard.Summarizable
> = {
  length: ({ value }) => <SuffixDisplay suffix="mm">{value}</SuffixDisplay>,
  base_frequency: ({ value }) => (
    <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>
  ),
  boost_frequency: ({ value }) => (
    <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>
  ),
  minimum_psu: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  GraphicCard.Label,
  GraphicCard.SummaryAttributes
);
