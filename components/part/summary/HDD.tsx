import { GenericSummaryCells } from "../TableWrapper";
import HDD from "@/utils/interface/info/HDD";
import { FunctionComponent } from "react";

const Components: {
  [key in HDD.Summarizable]: FunctionComponent<{ value?: HDD.Info[key] }>;
} = {
  capacity: ({ value }) => value,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  HDD.Label,
  HDD.SummaryAttributes
);
