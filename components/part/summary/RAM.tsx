import RAM from "@/utils/interface/part/RAM";
import { FunctionComponent } from "react";
import { GenericSummaryCells } from "../TableWrapper";

const Components: {
  [key in RAM.Summarizable]: FunctionComponent<{ value?: RAM.Info[key] }>;
} = {
  speed: ({ value }) => value,
  capacity: ({ value }) => value,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  RAM.Label,
  RAM.SummaryAttributes
);
