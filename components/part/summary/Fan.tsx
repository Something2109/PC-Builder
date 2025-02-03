import { GenericSummaryCells } from "../TableWrapper";
import Fan from "@/utils/interface/part/Fan";
import { FunctionComponent } from "react";

const Components: {
  [key in Fan.Summarizable]: FunctionComponent<{ value?: Fan.Info[key] }>;
} = {
  form_factor: ({ value }) => value,
  speed: ({ value }) => value,
  bearing: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Fan.Label,
  Fan.SummaryAttributes
);
