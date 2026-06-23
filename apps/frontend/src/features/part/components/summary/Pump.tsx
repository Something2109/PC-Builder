import * as Pump from "@pc-builder/shared/part/product/Pump";

import { SuffixDisplay } from "@/ui/Display";

import { GenericSummaryCells, InfoSummaryMapping } from "../utils/Summary";

const Components: InfoSummaryMapping<Pump.Summary> = {
  form_factor: ({ value }) => value,
  head_pressure: ({ value }) => <SuffixDisplay suffix="m">{value}</SuffixDisplay>,
  flow_rate: ({ value }) => <SuffixDisplay suffix="L/h">{value}</SuffixDisplay>,
  power_connector: ({ value }) => value,
};

const Classes: Partial<Record<keyof Pump.Summary, string>> = {
  form_factor: "lg:w-36 lg:min-w-32",
  head_pressure: "text-right font-mono tabular-nums lg:w-36 lg:min-w-32",
  flow_rate: "text-right font-mono tabular-nums lg:w-32 lg:min-w-28",
  power_connector: "lg:w-40 lg:min-w-36",
};

export default GenericSummaryCells(
  Components,
  Pump.AttributeLabels,
  Pump.Summary.keyof().options,
  Classes
);
