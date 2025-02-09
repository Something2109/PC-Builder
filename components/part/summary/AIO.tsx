import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import AIO from "@/utils/interface/info/AIO";

const Components: InfoSummaryMapping<AIO.Info, AIO.Summarizable> = {
  form_factor: ({ value }) => value,
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  AIO.Label,
  AIO.SummaryAttributes
);
