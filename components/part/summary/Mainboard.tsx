import { GenericSummaryCells } from "../TableWrapper";
import Mainboard from "@/utils/interface/info/Mainboard";
import { FunctionComponent } from "react";

const Components: {
  [key in Mainboard.Summarizable]: FunctionComponent<{
    value?: Mainboard.Info[key];
  }>;
} = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  ram_form_factor: ({ value }) => value,
  ram_interface: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Mainboard.Label,
  Mainboard.SummaryAttributes
);
