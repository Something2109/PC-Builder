import PSU from "@/utils/interface/part/PSU";
import { FunctionComponent } from "react";
import { GenericSummaryCells } from "../TableWrapper";

const Components: {
  [key in PSU.Summarizable]: FunctionComponent<{ value?: PSU.Info[key] }>;
} = {
  wattage: ({ value }) => value,
  efficiency: ({ value }) => value,
  form_factor: ({ value }) => value,
  modular: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  PSU.Label,
  PSU.SummaryAttributes
);
