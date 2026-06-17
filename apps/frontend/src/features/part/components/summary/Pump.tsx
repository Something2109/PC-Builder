import { SuffixDisplay } from "@/ui/Display";
import * as Pump from "@/utils/part/product/Pump";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Pump.Summary> = {
  form_factor: ({ value }) => value,
  head_pressure: ({ value }) => <SuffixDisplay suffix="m">{value}</SuffixDisplay>,
  flow_rate: ({ value }) => <SuffixDisplay suffix="L/h">{value}</SuffixDisplay>,
  power_connector: ({ value }) => value,
};

const Classes: Partial<Record<keyof Pump.Summary, string>> = {
  form_factor: "lg:w-32 lg:min-w-24",
  head_pressure: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  flow_rate: "text-right font-mono tabular-nums lg:w-28 lg:min-w-24",
  power_connector: "lg:w-32 lg:min-w-24",
};

export default GenericSummaryCells(
  Components,
  Pump.AttributeLabels,
  Pump.Summary.keyof().options,
  Classes
);
