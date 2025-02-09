import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";
import Pump from "@/utils/interface/info/Pump";

const Components: InfoSummaryMapping<Pump.Info, Pump.Summarizable> = {
  head_pressure: ({ value }) => (
    <SuffixDisplay suffix="m">{value}</SuffixDisplay>
  ),
  flow_rate: ({ value }) => <SuffixDisplay suffix="L/h">{value}</SuffixDisplay>,
  power_connector: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Pump.Label,
  Pump.SummaryAttributes
);
