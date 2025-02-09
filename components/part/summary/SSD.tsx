import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import SSD from "@/utils/interface/info/SSD";

const Components: InfoSummaryMapping<SSD.Info, SSD.Summarizable> = {
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
