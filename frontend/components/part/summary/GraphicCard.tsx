import { SuffixDisplay } from "@/components/utils/Display";
import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";
import * as GraphicCard from "@/utils/part/product/GraphicCard";

const Components: InfoSummaryMapping<GraphicCard.Summary> = {
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
  GraphicCard.AttributeLabels,
  GraphicCard.Summary.keyof().options
);
