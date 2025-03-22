import { GenericSummaryCells, InfoSummaryMapping } from "../TableWrapper";
import { SuffixDisplay } from "@/components/utils/Display";
import Pump from "@/utils/interface/product/Pump";

const Components: InfoSummaryMapping<Pump.Summary> = {
  form_factor: ({ value }) => value,
  head_pressure: ({ value }) => (
    <SuffixDisplay suffix="m">{value}</SuffixDisplay>
  ),
  flow_rate: ({ value }) => <SuffixDisplay suffix="L/h">{value}</SuffixDisplay>,
  power_connector: ({ value }) => value,
};

export default GenericSummaryCells(
  Components,
  Pump.AttributeLabels,
  Pump.Summary.keyof().options
);
