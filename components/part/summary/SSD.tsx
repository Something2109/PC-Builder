import { GenericSummaryCells } from "../TableWrapper";
import SSD from "@/utils/interface/info/SSD";
import { FunctionComponent } from "react";

const Components: {
  [key in SSD.Summarizable]: FunctionComponent<{ value?: SSD.Info[key] }>;
} = {
  read_speed: ({ value }) => value,
  write_speed: ({ value }) => value,
  form_factor: ({ value }) => value,
  interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  SSD.Label,
  SSD.SummaryAttributes
);
