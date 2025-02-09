import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import Cooler from "@/utils/interface/info/Cooler";

const Components: InfoSummaryMapping<Cooler.Info, Cooler.Summarizable> = {
  socket: ({ value }) => value,
  cpu_plate: ({ value }) => value,
  height: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Cooler.Label,
  Cooler.SummaryAttributes
);
