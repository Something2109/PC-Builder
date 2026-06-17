import { SuffixDisplay } from "@/ui/Display";
import * as GraphicCard from "@/utils/part/product/GraphicCard";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<GraphicCard.Summary> = {
  length: ({ value }) => <SuffixDisplay suffix="mm">{value}</SuffixDisplay>,
  base_frequency: ({ value }) => <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>,
  boost_frequency: ({ value }) => <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>,
  minimum_psu: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  GraphicCard.AttributeLabels,
  GraphicCard.Summary.keyof().options
);
