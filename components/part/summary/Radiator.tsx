import Radiator from "@/utils/interface/part/Radiator";
import { GenericSummaryCells } from "../TableWrapper";
import { FunctionComponent } from "react";

const Components: {
  [key in Radiator.Summarizable]: FunctionComponent<{
    value?: Radiator.Info[key];
  }>;
} = {
  form_factor: ({ value }) => value,
  material: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Radiator.Label,
  Radiator.SummaryAttributes
);
