import { GenericSummaryCells } from "../TableWrapper";
import GraphicCard from "@/utils/interface/part/GraphicCard";
import { FunctionComponent } from "react";

const Components: {
  [key in GraphicCard.Summarizable]: FunctionComponent<{
    value?: GraphicCard.Info[key];
  }>;
} = {
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
