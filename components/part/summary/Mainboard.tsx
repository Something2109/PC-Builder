import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import Mainboard from "@/utils/interface/info/Mainboard";

const Components: InfoSummaryMapping<Mainboard.Info, Mainboard.Summarizable> = {
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
