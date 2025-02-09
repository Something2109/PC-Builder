import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import RAM from "@/utils/interface/info/RAM";

const Components: InfoSummaryMapping<RAM.Info, RAM.Summarizable> = {
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
