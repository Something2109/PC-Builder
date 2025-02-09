import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import Pump from "@/utils/interface/info/Pump";

const Components: InfoSummaryMapping<Pump.Info, Pump.Summarizable> = {
  head_pressure: ({ value }) => value,
  flow_rate: ({ value }) => value,
  power_connector: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Pump.Label,
  Pump.SummaryAttributes
);
