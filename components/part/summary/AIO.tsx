import { GenericSummaryCells } from "../TableWrapper";
import AIO from "@/utils/interface/info/AIO";
import { FunctionComponent } from "react";

const Components: {
  [key in AIO.Summarizable]: FunctionComponent<{ value?: AIO.Info[key] }>;
} = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  AIO.Label,
  AIO.SummaryAttributes
);
