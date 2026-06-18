import { SuffixDisplay } from "@/ui/Display";
import * as GraphicCard from "@/utils/part/product/GraphicCard";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<GraphicCard.Summary> = {
  length: ({ value }) => <SuffixDisplay suffix="mm">{value}</SuffixDisplay>,
  base_frequency: ({ value }) => <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>,
  boost_frequency: ({ value }) => <SuffixDisplay suffix="MHz">{value}</SuffixDisplay>,
  minimum_psu: ({ value }) => value,
};

const Classes: Partial<Record<keyof GraphicCard.Summary, string>> = {
  length: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  base_frequency: "text-right font-mono tabular-nums lg:w-40 lg:min-w-36",
  boost_frequency: "text-right font-mono tabular-nums lg:w-40 lg:min-w-36",
  minimum_psu: "text-right font-mono tabular-nums lg:w-36 lg:min-w-32",
};

export default GenericSummaryCells(
  Components,
  GraphicCard.AttributeLabels,
  GraphicCard.Summary.keyof().options,
  Classes
);
