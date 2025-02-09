import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import GraphicCard from "@/utils/interface/info/GraphicCard";

const Components: InfoSummaryMapping<
  GraphicCard.Info,
  GraphicCard.Summarizable
> = {
  length: ({ value }) => value,
  base_frequency: ({ value }) => value,
  boost_frequency: ({ value }) => value,
  minimum_psu: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  GraphicCard.Label,
  GraphicCard.SummaryAttributes
);
